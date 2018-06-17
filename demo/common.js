(() => {
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
      console.log(`${node}: ${message}`)
      const div = document.createElement('div')
      div.innerText = message
      logs.appendChild(div)
    })
  }
})()
