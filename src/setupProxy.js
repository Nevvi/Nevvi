const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.REACT_APP_API_BASE_URL,
            changeOrigin: true,
        })
    );
}