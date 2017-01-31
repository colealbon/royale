module.exports = {
    context: __dirname,
    entry: {
        hotlips: './src/index.js'
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
