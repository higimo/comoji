const webpack           = require('webpack')
const path              = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS        = new ExtractTextPlugin('bundle.css', {allChunks: true})

const NODE_ENV = process.env.NODE_ENV || 'prod',
	plugins    = [],
	rules      = []

console.log(NODE_ENV + ' mode.')

if (NODE_ENV === 'prod') {
	plugins.push(new webpack.optimize.UglifyJsPlugin())
}
plugins.push(new (require('html-webpack-plugin'))({
	template: './src/html/index.html',
	inject: 'body',
	title: 'Комоджи (⌐■_■)',
	minify: {
		html5           : true,
		useShortDoctype : true,
	},
	hash: true
}))
plugins.push(extractCSS)
plugins.push(new webpack.DefinePlugin({
	DEV_MODE: NODE_ENV !== 'prod',
	'process.env.NODE_ENV': (NODE_ENV === 'prod' ? JSON.stringify('production') : JSON.stringify('development'))
}))

rules.push({
	test: /\.scss$/,
	loader: extractCSS.extract({
		use: [
			{
				loader: 'css-loader',
			},
			{
				loader: 'postcss-loader',
				options: {
					plugins: [
						require('postcss-import'),
						require('postcss-simple-vars'),
						require('postcss-hexrgba'),
						require('postcss-nested'),
						require('postcss-extend'),
						require('lost'),
						require('postcss-custom-media'),
						require('autoprefixer'),
						...(NODE_ENV === 'prod' ? [require('cssnano')] : []),
					]
				}
			},
		]
	})
})

rules.push({
	test: /\.js$/,
	exclude: [
		path.resolve(__dirname, 'node_modules'),
	],
	use: {
		loader: 'babel-loader',
		options: {
			presets: [
				'react',
				'es2015',
				'stage-2',
				...(NODE_ENV === 'prod' ? ['minify'] : []),
			],
			plugins: [
				[
					'transform-react-statements',
					{
						keyIs: 'id'
					}
				],
				[
					'transform-object-rest-spread',
					{
						'useBuiltIns': true
					}
				],
				...(
					NODE_ENV === 'prod' ? [
						'transform-inline-consecutive-adds',
						'transform-merge-sibling-variables',
						'transform-remove-console',
						'transform-remove-debugger',
						'transform-simplify-comparison-operators',
					] : []
				),
			]
		}
	}
})

module.exports = {
	devtool: NODE_ENV === 'dev' ? 'eval' : false,
	watchOptions: {
		aggregateTimeout : 100,
	},
	entry: {
		'bundle.js': './src/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'www/'),
		filename: 'bundle.js'
	},
	module: {
		rules,
	},
	plugins,
	devServer: {
		contentBase        : path.join(__dirname, 'www/'),
		compress           : true,
		port               : 9000,
		historyApiFallback : true,
		proxy: {
			'/api': {
				target: 'http://test.ru:80/api/',
				pathRewrite: {
					'^/api' : ''
				},
				changeOrigin: true
			},
			'/upload': {
				target: 'http://test.ru:80/upload/',
				pathRewrite: {
					'^/upload' : ''
				},
				changeOrigin: true
			}
		},
		stats: {
			assets          : true,
			cached          : false,
			cachedAssets    : false,
			children        : false,
			chunks          : false,
			chunkModules    : false,
			chunkOrigins    : false,
			colors          : true,
			depth           : false,
			entrypoints     : true,
			env             : false,
			errors          : true,
			errorDetails    : true,
			hash            : false,
			maxModules      : 15,
			modules         : false,
			moduleTrace     : false,
			performance     : true,
			providedExports : false,
			publicPath      : true,
			reasons         : false,
			source          : false,
			timings         : true,
			usedExports     : false,
			version         : true,
		}
	}
}
