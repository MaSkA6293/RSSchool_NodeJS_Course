import path from 'path';
import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import nodeExternals from 'webpack-node-externals';

const isProduction = process.env.NODE_ENV === 'production';

const config: Configuration = {
  target: 'node',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(ts)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: [nodeExternals()],
};

export default () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
