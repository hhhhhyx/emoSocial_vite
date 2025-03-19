module.exports = {
    assetsDir: 'static',
    devServer: {
        proxy: {
            '/': {
                target: 'http://localhost:38015/', 
                changeOrigin: true, 
                ws: true,
                pathRewrite: {
                    '^/': ''
                }
            },
        }
    }
};
