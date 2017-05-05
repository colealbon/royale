module.exports = {
    context: __dirname,
    devtool: 'inline-source-map',
    entry: {
        royale: './src/index.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    },
    externals: [
    {
        "openpgp": "openpgp"
    }],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
