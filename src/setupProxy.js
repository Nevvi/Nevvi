const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    // TODO - can we do this in a way that doesnt require one entry per api?
    app.use(
        '/authentication',
        createProxyMiddleware({
            target: process.env.REACT_APP_API_BASE_URL,
            changeOrigin: true,
        })
    );
}