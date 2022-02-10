const webpack = require('webpack')


function run(webpackConfig) {
  webpackConfig.mode = 'development'
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
      console.log(`hot update success! ${Date.now()}`)
    }
  })
}
module.exports = run
