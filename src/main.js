'use strict'

var app = require('app')
var globalShortcut = require('global-shortcut')
var BrowserWindow = require('browser-window')
var path = require('path')

app.on('ready', function () {
  // https://github.com/atom/electron/blob/master/docs/api/browser-window.md
  var win = new BrowserWindow({
    center: true,
    width: 700,
    height: 500,
    resizable: false,
    // 'always-on-top': true,
    'skip-taskbar': true,
    show: true,
    frame: false,
    // transparent: true,
    type: 'panel'
  // 'zoom-factor': 2.0
  })
  win.loadUrl('file://' + path.join(__dirname, '/window.html'))
  win.setMenu(null)
  win.setVisibleOnAllWorkspaces(true)
  // win.setAlwaysOnTop(true)
  // panel.window.openDevTools({detach: true})

  var ret = globalShortcut.register('CommandOrControl+Space', function () {
    win.show()
  })

  if (!ret) {
    console.log('registration failed')
  }
})

require('crash-reporter').start()
