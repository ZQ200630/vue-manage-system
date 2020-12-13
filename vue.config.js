module.exports = {
    publicPath: './',
    assetsDir: './static',
    productionSourceMap: false,
    devServer: {
        port: 3000,
        disableHostCheck: true
    }
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
}