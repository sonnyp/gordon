import {exec} from 'child_process'

export default [
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
