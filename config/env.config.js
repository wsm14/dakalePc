export default {
  dev: {
    define: {
      APIURL: '', // 使用proxy代理 不配置
    },
    proxy: {
      '/merchant': {
        target: 'https://devgateway.dakale.net/',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://192.168.0.143:6020/',
        changeOrigin: true,
      },
    },
  },
  test: {
    define: {
      APIURL: 'http://192.168.0.102:3500',
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
      APIURL: 'https://devgateway.dakale.net/',
    },
  },
};
