const webpack = require('webpack')


function run(webpackConfig) {
  webpackConfig.mode = 'production'
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    SCRIPT_MODE: '"production"'
  }))
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err)
    }
    if (stats.hasErrors()) {
      stats.compilation.errors.forEach(value => console.error(value))
    } else {
      console.log(stats.toString({
        colors: true
      }))
      if (webpackConfig.mode !== 'production') {
        console.warn('the "development" mode could not run in browser, it will throw a error in your browser console!')
      }
    }
  })
}
module.exports = run
