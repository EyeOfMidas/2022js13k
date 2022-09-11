const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: './js/main.js',
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  output: {
    filename: 'min.js',
    path: path.resolve(__dirname, '.'),
  },
}
