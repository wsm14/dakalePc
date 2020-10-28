export default {
  dev: {
    define: {
      APIURL: '', // 使用proxy代理 不配置
    },
    proxy: {
      '/admin': {
        target: 'http://192.168.0.143:6020/', // http://192.168.0.143:6020/
        changeOrigin: true,
      },
      '/common': {
        target: 'http://192.168.0.143:6020/',
        changeOrigin: true,
      },
      '/media': {
        target: 'https://static.dingtalk.com/',
        changeOrigin: true,
      },
    },
  },

  test: {
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
  // 预发布环境
  pre: {
    define: {
      APIURL: 'https://pregateway.dakale.net',
    },
  },
  // 生产环境proxy代理 不生效
  prod: {
    define: {
      APIURL: 'https://gateway1.dakale.net',
    },
  },
};
