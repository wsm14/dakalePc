export default {
  dev: {
    define: {
      APIURL: '', // 使用proxy代理 不配置
    },
    proxy: {
      '/admin': {
        target: 'http://192.168.0.143:6020/',
        changeOrigin: true,
      },
      '/common': {
        target: 'https://devgateway.dakale.net/',
        changeOrigin: true,
      },
    },
  },
  test: {
    // https://web-new.dakale.net/dev/page/bannerShare/goodsStoreDaka.html
    define: {
      APIURL: 'https://devgateway.dakale.net',
    },
    proxy: {
      '/api/': {
        target: 'your pre url',
        changeOrigin: true,
      },
    },
  },
  // 生产环境proxy代理 不生效
  prod: {
    define: {
      APIURL: 'https://devgateway.dakale.net',
    },
  },
};
