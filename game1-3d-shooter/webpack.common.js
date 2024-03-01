require('dotenv').config({ path: '../.env' });

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fs = require('fs');
const { webpack, DefinePlugin } = require('webpack');

const appName = '3d-shooter';
const workDir = path.resolve(__dirname);
// Dist folder is one level up from workDir to serve as part of the Rest project
const dist = path.resolve(__dirname, '..', '_dist', appName);

module.exports = {
  mode: 'development',
  stats: 'errors-only',
  devtool: 'inline-source-map',
  devServer: {
    devMiddleware: {
      writeToDisk: true
    }
  },
  entry: {
    app: './index.ts'
  },
  output: {
    filename: '[name].js',
    path: dist
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json', '.css', '.scss'],
    alias: {
      src: workDir,
      ...fs.readdirSync(workDir, { withFileTypes: true })
           .filter(dirent => dirent.isDirectory())
           .reduce((acc, file) => ({ ...acc, [file.name]: path.join(workDir, file.name) }), {})
    },
    fallback: {
      path: require.resolve('path-browserify'),
      fs: false,
    }
  },
  module: {
    rules: [
      { test: /\.m?js$/, exclude: /node_modules/, use: [{ loader: 'babel-loader' }] },
      { test: /\.tsx?$/, exclude: /node_modules/, use: 'ts-loader' },
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
      cache: false,
      restRootScriptImport: `<script defer src="${appName}/app.js"></script>`
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join(workDir, 'assets'), to: path.join(dist, 'assets') },
      ],
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ]
}
