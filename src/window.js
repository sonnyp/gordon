;(function () {
  'use strict'

  var fs = require('fs')
  var path = require('path')
  var exec = require('child_process').exec

  var actions = [
    // media
    {
      'key': 'XF86AudioPlay',
      'matches': ['play', 'audio play', 'video play', 'media play'],
      'description': 'Play audio'
    },
    {
      'key': 'XF86AudioPause',
      'matches': ['pause', 'audio pause', 'video pause', 'media pause'],
      'description': 'Pause audio'
    },
    {
      'key': 'XF86AudioPrev',
      'matches': ['previous', 'audio previous', 'video previous', 'media pause'],
      'return': false,
      'description': 'Play previous song'
    },
    {
      'key': 'XF86AudioNext',
      'matches': ['next', 'audio next', 'video next', 'media next'],
      'return': false,
      'description': 'Play next song'
    },

    // volume
    {
      // 'key': 'XF86AudioMute',
      'exec': 'pactl set-sink-mute 0 toggle',
      'matches': [
        'mute', 'unmute',
        'audio mute', 'audio unmute',
        'video mute', 'video unmute',
        'media mute', 'media unmute',
        'volume mute', 'volume unmute'
      ],
      'description': 'Toggle mute/unmute volume'
    },
    {
      'exec': 'pactl set-sink-volume 0 +15%',
      // 'key': 'XF86AudioRaiseVolume',
      'matches': ['volume up', 'raise volume', '+volume', 'volume+'],
      'return': false,
      'description': 'Raise audio volume'
    },
    {
      'exec': 'pactl set-sink-volume 0 -15%',
      // 'key': 'XF86AudioLowerVolume',
      'matches': ['volume down', 'lower volume', '-volume', 'volume-'],
      'return': false,
      'description': 'Lower audio volume'
    },

    // brightness
    {
      'key': 'XF86MonBrightnessUp',
      'matches': ['brightness up', 'bright up', 'raise brightness', '+brightness'],
      'return': false,
      'description': 'Increase screen brightness'
    },
    {
      'key': 'XF86MonBrightnessDown',
      'matches': ['brightness down', 'bright down', 'lower brightness', '-brightness'],
      'return': false,
      'description': 'Decrease screen brightness'
    },

    // workspaces
    {
      'description': 'Go to next workspace',
      'matches': ['next workspace', 'workspace next', '+workspace'],
      'return': false,
      'exec': function () {
        exec('xdotool get_desktop', function (err, r) {
          if (err) return

          var num = parseInt(r.split('\n')[0], 10) + 1
          exec('xdotool set_desktop ' + num)
        })
      }
    },
    {
      'description': 'Go to previous workspace',
      'matches': ['previous workspace', 'workspace previous', '-workspace'],
      'return': false,
      'exec': function () {
        exec('xdotool get_desktop', function (err, r) {
          if (err) return

          var num = parseInt(r.split('\n')[0], 10) - 1
          exec('xdotool set_desktop ' + num)
        })
      }
    },

    // power
    {
      'description': 'Shutdown',
      'matches': ['halt', 'poweroff', 'shutdown'],
      'exec': 'dbus-send --system --print-reply --dest="org.freedesktop.ConsoleKit" /org/freedesktop/ConsoleKit/Manager org.freedesktop.ConsoleKit.Manager.Stop'
    },
    {
      'description': 'Reboot',
      'matches': ['reboot', 'restart'],
      'exec': 'dbus-send --system --print-reply --dest="org.freedesktop.ConsoleKit" /org/freedesktop/ConsoleKit/Manager org.freedesktop.ConsoleKit.Manager.Restart'
    },
    {
      'description': 'Suspend',
      'matches': ['suspend', 'sleep'],
      'exec': 'dbus-send --system --print-reply --dest="org.freedesktop.UPower" /org/freedesktop/UPower org.freedesktop.UPower.Suspend'
    },
    {
      'description': 'Hibernate',
      'matches': ['hibernate'],
      'exec': 'dbus-send --system --print-reply --dest="org.freedesktop.UPower" /org/freedesktop/UPower org.freedesktop.UPower.Hibernate'
    }
  ]

  var commands = {}

  var desktopEntry = require('node-x11-desktop-entry')
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
      console.log('keyCode', e.keyCode)
      // console.log('key', e.key)
      // console.log('charCode', e.charCode)
      // console.log('code', e.code)
      // console.log('keyIdentifier', e.keyIdentifier)
      // console.log(inputEl.value)

      // backspace
      if (e.keyCode === 8) {
        this.value = ''
        return
      }

      // enter
      if (e.keyCode !== 13) return

      var cmd = this.value
      var t = commands[cmd]
      console.log(t)
      if (!t) return

      if (typeof t.exec === 'string') {
        exec((t.terminal ? 'gnome-terminal -e ' : '') + t.exec)
      } else if (typeof t.exec === 'function') {
        t.exec()
      }

      if (t['return'] !== false) reset()
    })
  })
}())
