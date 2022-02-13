const webpack = require('webpack')
const ws = require('nodejs-websocket')
const constant = require('../src/constant')


function run(webpackConfig) {
  webpackConfig.mode = 'production'
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    SCRIPT_MODE: '"development"'
  }))

  const compiler = webpack(webpackConfig)

  const WEB_SOCKET_PORT = constant.WEBSOCKET_PORT

  const socket = ws.createServer(() => {
    //
  }).listen(WEB_SOCKET_PORT)

  console.log(`a websocket server is created on port ${WEB_SOCKET_PORT}, it will be used to hot update extension`)

  // dev watch
  compiler.watch({
    aggregateTimeout: 300
  }, (err, stats) => {
    if (stats.hasErrors()) {
      stats.compilation.errors.forEach(value => console.error(value))
    } else {
      console.log(stats.toString({
        chunks: false,
        colors: true
      }));
      console.log(`${new Date().toLocaleString()}: update success!`)
      if (webpackConfig.mode !== 'production') {
        console.warn('the "development" mode could not run in browser, it will throw a error in your browser console!')
      }
      // 让客户端重新加载拓展
      socket.connections.forEach(conn => {
        conn.sendText(JSON.stringify({order: 1, message: 'reload the plugin'}))
      })
    }
  })
}
module.exports = run
