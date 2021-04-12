// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../index.ts'),
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { allowTsInNodeModules: true }
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ],
  },
  output: {
    filename: 'topicDependenceVisualization.js',
    path: path.resolve(__dirname, '../module'),
    libraryTarget: "umd",
    library: 'topicDependenceVisualization',
  }
};
