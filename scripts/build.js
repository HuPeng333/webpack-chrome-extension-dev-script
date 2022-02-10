const webpack = require('webpack')


function run(webpackConfig) {
  webpackConfig.mode = 'production'
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
      }));
    }
  })
}
module.exports = run
