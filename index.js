// const {WEBSOCKET_PORT} = require("./src/constant")
// 避免导入其它依赖
const WEBSOCKET_PORT = 61581
module.exports.launchHotUpdate = () => {
  let socket = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}`)

  bindEvent(socket)

  function reconnect() {
    // 断开连接后自动重连
    const id = setInterval(() => {
      console.log('trying to reconnect to hot update server')
      try {
        const newSocket = new WebSocket(`ws://localhost:${WEBSOCKET_PORT}`)
        bindEvent(newSocket)
        socket = newSocket
        console.log('connect success')
        clearInterval(id)
      } catch (e) {
        console.log('connect fail!')
      }
    }, 3000)
  }

  function bindEvent(s) {
    s.onmessage = (event) => {
      if (event.data) {
        const data = JSON.parse(event.data)
        switch (data.order) {
          case 1:
            // reload plugin
            chrome.runtime.reload()
        }
      }
    }
    s.onclose = () => {
      reconnect()
    }
  }
}
