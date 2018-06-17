(() => {
  const pad = len => num => {
    num = '' + num
    while (num.length < len) {
      num = '0' + num
    }
    return num
  }

  const pad2 = pad(2)

  const pad3 = pad(3)

  const formatTime = date => {
    const hms = [date.getHours(), date.getMinutes(), date.getSeconds()]
      .map(pad2)
      .join(':')
    const ms = pad3(date.getMilliseconds())
    return `${hms}.${ms}`
  }

  const addLogEntry = (logs, message, isError = false) => {
    const time = formatTime(new Date())
    const div = document.createElement('div')
    div.className = isError ? 'error' : 'info'
    div.innerText = `[${time}] ${message}`
    logs.appendChild(div)
  }

  window.setUpLog = node => {
    const logs = document.createElement('fieldset')
    const legend = document.createElement('legend')
    legend.innerText = node.toString()
    logs.appendChild(legend)

    new Promise(resolve => {
      if (document.body != null) {
        resolve()
      } else {
        document.addEventListener('DOMContentLoaded', resolve)
      }
    }).then(() => {
      document.querySelector('.log').appendChild(logs)
    })

    node.addEventListener('log', ({ detail: { message } }) => {
      console.info(`${node}: ${message}`)
      addLogEntry(logs, message)
    })

    node.addEventListener('error', ({ detail: { error } }) => {
      const message = '' + error
      console.error(`${node}: ${message}`)
      addLogEntry(logs, message, true)
    })
  }
})()
