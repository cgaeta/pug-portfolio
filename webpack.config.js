const path = require('path');
const extract = require('extract-text-webpack-plugin');
const htmlWebPackPlugin = require('html-webpack-plugin');
const compressionPlugin = require('compression-webpack-plugin');
const test = require('./test');

module.exports = env => {
  const t = env.DEV ? "./test" : ".";

  //console.log(env.DEV, env.PROD, path.resolve(__dirname, './'), path.resolve('/'));

  const extractSass = new extract({
    //filename: "./test/css/[name].css"
    filename: t + "/css/[name].css"
    //disable: process.env.NODE_ENV === "development"
  });

  const html = (template, prod) => new htmlWebPackPlugin({
    template: 'templates/pages/' + template + '.pug',
    //filename: './test/' + template + '.html',
    filename: t + "/" + template + ".html",
    inject: false,
    cache: !prod
    //minify: prod //process.env.NODE_ENV === 'production'
  });

  return {
    entry: {
      'scripts': './js/dep/main.js',
      'all': './css/all.js',
      'index': './css/index.js',
      'projectStyles': './css/projectStyles.js'
    },
    output: {
      //filename: './test/js/[name].js',
      filename: t + "/js/[name].js",
      path: path.resolve(__dirname, './')
    },
    resolve: {
      modules: [
        __dirname,
        'node_modules'
      ]
    },
    module: {
      rules: [{
        test: [/\.scss$/, /\.css$/],
        use: extractSass.extract({
          use: [{
            loader: "css-loader",
            options: {
              minimize: env.PROD,
              sourceMap: env.DEV
            }
          }, {
            loader: "sass-loader",
            options: {sourceMap: env.DEV}
          }],
          fallback: "style-loader"
        })
      },
      {
        test: /\.(png|jpg|gif|svg|eot|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: env.LIMIT || 10000,
          query: {
            useRelativePath: false,
            //publicPath: "/test/img/"
            publicPath: t + "/img/"
          },
          //outputPath: "test/img/",//path.resolve(__dirname, "test/img"),
          outputPath: t + "/img/",
          publicPath: "/",//path.resolve(__dirname, "test/img/"),
          name: "[name].[ext]"
        }
      },
      {
        test: /\.(ttf)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: "[name].[ext]",
          outputPath: t + "/font/",//path.resolve(__dirname, "test/font"),
          publicPath: "/",//path.resolve(__dirname, "test/font/"),
          useRelativePath: false
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          //root: path.resolve(__dirname, './'),
          root: path.resolve('/'),
          pretty: env.DEV
        }
      }]
    },
    plugins: [
      extractSass,
      html('index', env.PROD),
      html('about', env.PROD),
      html('resume', env.PROD),
      new compressionPlugin({
        test: /\.(js|css|html|ttf)$/,
        minRatio: 0.25
      }),
      new test({})
    ],
    devServer: {'compress': env.PROD}
  }
};
