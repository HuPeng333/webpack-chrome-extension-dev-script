const webpack = require('webpack')


function run(webpackConfig) {
  webpackConfig.mode = 'production'
  const compiler = webpack(webpackConfig);

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
    }
  })
}
module.exports = run
