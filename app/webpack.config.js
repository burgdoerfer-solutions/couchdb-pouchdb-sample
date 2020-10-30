const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')

/** @type {import('webpack').Configuration} */
module.exports = {
  performance: { hints: false },
  entry: {
    'list-page': './lib/ListPage',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: require.resolve('babel-loader'),
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader'),
          require.resolve('postcss-loader'),
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      chunks: ['list-page'],
    }),
    ...(process.env.NODE_ENV === 'production'
      ? [
          new GenerateSW({
            skipWaiting: true,
            clientsClaim: true,
            maximumFileSizeToCacheInBytes: 1024 * 1024 * 1024 * 5,
            ignoreURLParametersMatching: [/.*/],
          }),
        ]
      : []),
  ],
  devServer: {
    proxy: {
      '/couchdb': {
        target: 'http://localhost:5984',
        pathRewrite: { '^/couchdb': '' },
      },
    },
  },
}
