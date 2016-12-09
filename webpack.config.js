/* eslint-disable no-var */
var path = require('path');
var webpack = require('webpack');
var cssnano = require('cssnano');
var copy = require('copy-webpack-plugin');
var clean = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var HOST = process.env.HOST || '0.0.0.0';
var PORT = process.env.PORT || '8081';
var ROOT_PATH = path.resolve(__dirname);
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var DIST_PATH = path.resolve(ROOT_PATH, 'dist');
var MODULE_PATH = path.resolve(ROOT_PATH, 'node_modules');
var ENV = process.env.NODE_ENV || 'development';

const cssModulesLoader = [
  'css?sourceMap&-minimize',
  'modules',
  'importLoaders=1',
  'localIdentName=[name]__[local]___[hash:base64:5]'
].join('&');

var conf = {
  context: ROOT_PATH,
  entry: [
    './src/index'
  ],
  output: {
    path: DIST_PATH,
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss']
  },
  module: {
    loaders: [
      {
        // test: /(\.css|\.scss)$/,
        // loaders: [
        //   'style',
        //   cssModulesLoader,
        //   //'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        //   'sass?sourceMap',
        //   'postcss',
        //   'sass'
        // ]
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          SRC_PATH,
          path.resolve(MODULE_PATH, 'react-toolbox')
        ]
      },
      {
        test: /\.svg$/,
        loader: 'babel!svg-react'
      }
    ]
  },
  
  sassLoader: {
    data: '@import "' + [path.resolve(SRC_PATH, 'shared/_globals.scss')] + '";'
  },
  
  postcss: [
    cssnano({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 2 versions']
      },
      discardComments: {
        removeAll: true
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: ENV === 'development' ? true : false
    })
  ],
  resolve: {
    alias: {
      'components': path.resolve(SRC_PATH, 'components'),
      'utils': path.resolve(SRC_PATH, 'utils'),
      'static': path.resolve(ROOT_PATH, 'static')
    }
  }
};

if(ENV === 'production') {
  conf.plugins = [
    new clean(['dist'], {
      root: ROOT_PATH
    }),
    new webpack.DefinePlugin({
      'process.env':{ NODE_ENV: '"production"' }
    }),
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true
			},
			comments: false
		}),
    new copy([
      { from: path.resolve(SRC_PATH, 'index.html'), to: path.resolve(DIST_PATH, 'index.html') },
      { from: 'static', to:'static' }
    ])
  ]
  conf.devtool = 'cheap-module-source-map';
}else{
  conf.plugins = [
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new copy([
      { from: path.resolve(SRC_PATH, 'index.html'), to: path.resolve(DIST_PATH, 'index.html') },
      { from: 'static', to:'static' }
    ])
  ];
  conf.devServer = {
    port: PORT,
		host: HOST,
    outputPath: DIST_PATH,
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: true
  };
  conf.devtool = 'eval-source-map';
}

module.exports = conf;
