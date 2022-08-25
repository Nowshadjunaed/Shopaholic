const { createProxyMiddleware } = require("http-proxy-middleware");

const ecom_api = {
  target: "http://127.0.0.1:5000",
  changeOrigin: true,
};
const bank_api = {
  target: "http://127.0.0.1:7000",
  changeOrigin: true,
};

module.exports = function (app) {
  app.use("/api/*", createProxyMiddleware(ecom_api));

  app.use("/bankapi/*", createProxyMiddleware(bank_api));
};
