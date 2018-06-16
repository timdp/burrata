(() => {
  window.setUpLog = peer => {
    const logs = document.createElement('fieldset')
    const legend = document.createElement('legend')
    legend.innerText = peer.toString()
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

    peer.addEventListener('log', ({ detail: { message } }) => {
      console.log(`${peer}: ${message}`)
      const div = document.createElement('div')
      div.innerText = message
      logs.appendChild(div)
    })
  }
})()
