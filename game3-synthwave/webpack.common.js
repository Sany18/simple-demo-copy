require('dotenv').config({ path: '../.env' });

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');

const workDir = path.resolve(__dirname);
const dist = path.resolve(__dirname, '..', '_dist', 'synthwave');

module.exports = {
  mode: 'development',
  stats: 'errors-only',
  devtool: 'inline-source-map',
  entry: {
    app: './index.js'
  },
  output: {
    filename: '[name].js',
    path: dist
  },
  resolve: {
    extensions: ['.js', '.json', 'css', 'scss'],
    alias: {
      src: workDir,
      ...fs.readdirSync(workDir, { withFileTypes: true })
           .filter(dirent => dirent.isDirectory())
           .reduce((acc, file) => ({ ...acc, [file.name]: path.join(workDir, file.name) }), {})
    }
  },
  module: {
    rules: [
      { test: /\.m?js$/, exclude: /node_modules/, use: [{ loader: 'babel-loader' }] },
      { test: /\.s[ac]ss$/i, use: [ 'style-loader', 'css-loader', 'sass-loader' ] },
      { test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{ loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'fonts/' } }]
      },
      { test: /\.(jpg|png|svg)$/,
        use: [{ loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'image/' }}]
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(workDir, 'index.html'),
      cache: false
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(workDir, 'assets/models'), to: dist + '/models' },
      ],
    }),
  ]
}
