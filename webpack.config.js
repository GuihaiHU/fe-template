var appConfig = require('./app.config');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

if (process.env.NODE_ENV != 'production') process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var PRODUCTION = process.env.NODE_ENV == 'production';

var config = {
    entry: {
        app: './src/index',
        vendor: ['vue', 'vue-router', 'vue-resource', 'vuex'],
    },

    output: {
        path: path.resolve('dist'),
        filename: PRODUCTION ? '[name]-[chunkhash].js' : '[name].js',
        publicPath: PRODUCTION ? '/assets/' : '/',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use:[
                    {
                        loader:'vue-loader',
                        options: {
                            loaders: {
                                css: ExtractTextPlugin.extract({
                                    loader: 'css-loader',
                                    fallbackLoader: 'vue-style-loader'
                                })
                            }
                        }
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ]
            },{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },{
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },{
                test: /\.(jpg|png|gif|svg)$/,
                loader: 'file-loader',
            }
        ]
    },
    resolve: {
        modules: [
            'src',
            'node_modules',
        ],
        alias: {
            // vue: 'vue/dist/vue.js'
        },
    },
    plugins: [
        new webpack.ProvidePlugin({}),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new ExtractTextPlugin(PRODUCTION ? '[name]-[chunkhash].css' : '[name].css'),
        new HtmlWebpackPlugin({
            template: './src/index.templ.html'
        }),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(PRODUCTION),
            APP_CONFIG: JSON.stringify(appConfig[process.env.NODE_ENV]),
        }),
        new webpack.LoaderOptionsPlugin({
            vue: {
                // use custom postcss plugins
                postcss: function(webpack) {
                    return [
                        // require('precss')(),
                        // require('postcss-import')({addDependencyTo: webpack}),
                        // require('postcss-partial-import')({addDependencyTo: webpack}),
                        require('postcss-smart-import')({
                            addDependencyTo: webpack,
                            // root: path.resolve('src'),   // WARN: Not work as expected!
                            path: [path.resolve('src')],
                        }),
                        require('postcss-mixins'),
                        require('postcss-for')(),
                        require('postcss-nested'),
                        require('postcss-cssnext')({
                            'browsers': [
                                '> 1%',
                                'last 2 versions',
                                'ios_saf >= 6',
                            ]
                        }),
                        require('postcss-simple-vars')(),
                    ];
                }
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
    ],
    devtool: 'source-map',
};

PRODUCTION && Array.prototype.push.apply(config.plugins, [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
]);

module.exports = config;
