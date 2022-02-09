const webpack = require('webpack')
const webpackConfig = require('../webpack.config')


function run() {
  webpackConfig.mode = 'production'
  const compiler = webpack(webpackConfig);
  compiler.run((err, stats) => {
    console.log(webpackConfig)
    if (err) {
      console.error(err)
    }
    if (stats.hasErrors()) {
      stats.compilation.errors.forEach(value => console.error(value))
    } else {
      console.log(stats.toString({
        colors: true
      }));
    }
  })
}
module.exports = run
