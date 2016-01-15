import fs from 'fs'
import path from 'path'
import {exec} from 'child_process'
import actions from './actions'
import desktopEntry from 'node-x11-desktop-entry'

const debug = require('debug')('gordon:app')

window.addEventListener('focus', () => {
  debug('window focus')
})
window.addEventListener('blur', () => {
  debug('window blur')
})

var commands = {}

fs.readdir('/usr/share/applications/', function (err, filenames) {
  if (err) return console.error(err)

  filenames.forEach(function (filename) {
    desktopEntry.load({
      entry: path.join('/usr/share/applications/', filename),
      onSuccess: function (model) {
        var entry = model['Desktop Entry']
        if (!entry.Name || !entry.Exec) return

        var action = {
          description: entry.Name,
          exec: entry.Exec,
          matches: entry.Name,
          terminal: entry.Terminal === 'true'
        }

        addAction(action)
      },
      onError: function () {}
    })
  })
})

var addAction = function (action) {
  if (action.key) {
    action.exec = function () {
      console.log(action.key)
      exec('xdotool key ' + action.key)
    }
  }

  var matches = Array.isArray(action.matches) ? action.matches : [action.matches]
  matches.forEach(function (match) {
    commands[match.toLowerCase()] = action
  })
}

actions.forEach(addAction)

document.addEventListener('DOMContentLoaded', function () {
  var inputEl = document.querySelector('input')
  var itemsEl = document.getElementById('items')

  var reset = function () {
    inputEl.value = ''
    itemsEl.innerHTML = ''
  }

  inputEl.addEventListener('input', function () {
    itemsEl.innerHTML = ''
    var v = this.value.toLowerCase()
    if (v === '') return

    var yes = []

    for (var i in commands) {
      if (i.indexOf(v) !== 0) continue

      var cmd = commands[i]

      if (yes.indexOf(cmd) !== -1) continue

      yes.push(commands[i])
    }

    var frag = document.createDocumentFragment()

    yes.forEach(function (cmd) {
      var el = document.createElement('div')
      el.textContent = cmd.description
      frag.appendChild(el)
    })

    itemsEl.appendChild(frag)
  })
  inputEl.addEventListener('keypress', function (e) {
    debug('%s pressed %s', e.keyCode, String.fromCharCode(e.keyCode))

    // backspace
    if (e.keyCode === 8) {
      this.value = ''
      return
    }

    // enter
    if (e.keyCode !== 13) return

    var cmd = this.value
    var t = commands[cmd]
    if (!t) return

    if (typeof t.exec === 'string') {
      exec((t.terminal ? 'gnome-terminal -e ' : '') + t.exec)
    } else if (typeof t.exec === 'function') {
      t.exec()
    }

    if (t['return'] !== false) reset()
  })
})
