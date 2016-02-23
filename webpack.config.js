var path = require('path');
module.exports = {
    entry: "./js/index.js",
    output: {
        path: __dirname,
        filename: "main.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: path.join(__dirname, 'es6'), loader: 'babel-loader' },
            { test: /\.less$/, loader: "style!css!less"
            }
        ]
    }
};