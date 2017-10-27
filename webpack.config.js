const path = require('path');
const webpack = require('webpack');

var config = {
	entry: './src/index.jsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.jsx*$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader', 
			  	query: {
					presets: ['env','react']
			  	}
			},
			{
		      test: /\.scss$/,
		      loader: 'style-loader!css-loader!sass-loader'
		    },
		]
	},
	devServer : {
		contentBase: './dist'
	},
	node: {
	    fs: 'empty',
	    net: 'empty',
	    tls: 'empty'
  	},
  	plugins: []	
};

if(process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  )
}

module.exports = config;