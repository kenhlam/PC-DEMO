const path = require("path");
module.exports = {
    publicPath: "./",
    outputDir: "dist",
    assetsDir: "public",
    indexPath: "index.html",
    configureWebpack: {
        resolve: {
            alias: {
                "@": path.join(__dirname, "./src"),
                "@style": path.join(__dirname, "./src/assets/style"),
                "@components": path.join(__dirname, "./src/components"),
                "@views": path.join(__dirname, "./src/views")

            }
        }
    },
    chainWebpack: config => {
        config.plugins.delete("prefetch-index");
        config.plugins.delete("preload-index");
    },

    lintOnSave: false, // 是否在保存的时候检查
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
    runtimeCompiler: false, //是否开启构建版本 开启增加 10KB左右
    css: {
        extract: process.env.NODE_ENV === "production" ? true : false, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: process.env.NODE_ENV === "production" ? false : true, // 开启 CSS source maps
        requireModuleExtension: true,
        loaderOptions: {}
    },
    transpileDependencies: [],
    devServer: {
        // 环境配置
        // contentBase: path.join(__dirname, "dist"),
        // port: 9999,
        // https: false,
        // hotOnly: false,
        open: true, //配置自动启动浏览器
        // compress: false, //启用gzip压缩
        // proxy: currentPage.proxy || {}
    },
    pluginOptions: {}
};