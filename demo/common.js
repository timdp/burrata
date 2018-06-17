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
      const time = formatTime(new Date())
      console.log(`${node}: ${message}`)
      const div = document.createElement('div')
      div.innerText = `[${time}] ${message}`
      logs.appendChild(div)
    })
  }
})()
