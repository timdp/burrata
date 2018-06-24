;(() => {
  const pad = len => num => {
    num = '' + num
    while (num.length < len) {
      num = '0' + num
    }
    return num
  }

  const pad2 = pad(2)

  const pad3 = pad(3)

  const describe = win => {
    let descr = '[unknown]'
    try {
      descr = win.location.href
    } catch (_) {}
    return descr
  }

  const formatTime = date => {
    const hms = [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map(pad2)
      .join(':')
    const ms = pad3(date.getMilliseconds())
    return `${hms}.${ms}`
  }

  const addLogEntry = (logs, message, level) => {
    const time = formatTime(new Date())
    const div = document.createElement('div')
    div.className = level
    div.innerText = `[${time}] ${message}`
    logs.appendChild(div)
  }

  window.setUpLog = node => {
    const logs = document.createElement('div')
    logs.className = 'logs'

    new Promise(resolve => {
      if (document.body != null) {
        resolve()
      } else {
        document.addEventListener('DOMContentLoaded', resolve)
      }
    }).then(() => {
      document.querySelector('.log').appendChild(logs)
    })

    const log = (level, message) => {
      console[level](`${node}: ${message}`)
      addLogEntry(logs, message, level)
    }

    const logNodeEvents = n => {
      const prefix = node !== n ? `${n}: ` : ''
      const nodeLog = (level, message) => log(level, prefix + message)
      n.addEventListener('log', ({ detail: { message } }) => {
        nodeLog('info', message)
      })
      n.addEventListener('send', ({ detail: { data, target } }) => {
        nodeLog(
          'debug',
          `Sending ${JSON.stringify(data)} to ${describe(target)}`
        )
      })
      n.addEventListener('receive', ({ detail: { data, source } }) => {
        nodeLog(
          'debug',
          `Received ${JSON.stringify(data)} from ${describe(source)}`
        )
      })
      n.addEventListener('connect', ({ detail: { node: newNode } }) => {
        nodeLog('debug', `Accepting connection from ${newNode}`)
        logNodeEvents(newNode)
      })
      n.addEventListener('warn', ({ detail: { message } }) => {
        nodeLog('warn', message)
      })
      n.addEventListener('error', ({ detail: { error } }) => {
        nodeLog('error', '' + error)
      })
    }

    logNodeEvents(node)

    if (node.server != null) {
      logNodeEvents(node.server)
    }

    node.log('Starting')
  }

  window.delay = time =>
    new Promise(resolve => {
      setTimeout(resolve, time)
    })
})()
