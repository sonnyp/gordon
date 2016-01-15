'use strict'

import {app, globalShortcut, BrowserWindow} from 'electron'
import path from 'path'

const debug = require('debug')('gordon:app')

var win = null
app.on('ready', function () {
  debug('ready')
  // https://github.com/atom/electron/blob/master/docs/api/browser-window.md
  win = new BrowserWindow({
    title: app.getName(),
    center: true,
    width: 700,
    height: 500,
    resizable: false,
    alwaysOnTop: false,
    skipTaskbar: true,
    show: false,
    frame: false,
    // transparent: true,
    type: 'dock'
    // 'zoom-factor': 2.0
  })
  win.loadURL('file://' + path.join(__dirname, '/window.html'))
  // win.show()
  win.setMenu(null)
  // win.setVisibleOnAllWorkspaces(true)
  win.openDevTools({detach: true})

  var accel = 'CommandOrControl+Space'
  var ret = globalShortcut.register(accel, function () {
    debug('global shortcut %s triggered', accel)
    win.show()
  })

  win.on('ſocus', () => {
    debug('focus')
  })

  win.on('blur', () => {
    debug('blur')
    win.hide()
  })

  if (!ret) {
    debug('global shortcut %s could not be registered', accel)
  }
})

require('crash-reporter').start()
