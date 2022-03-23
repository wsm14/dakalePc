// const target = 'https://devgateway.dakale.net';
// const target = 'https://pregateway.dakale.net';
// const target = 'https://gateway1.dakale.net';
// const target = 'http://192.168.0.188:6020'
// const target = 'http://192.168.0.103:6020';
// const target = 'http://47.114.164.224:6020';
// const target = 'http://192.168.0.62:6020';
const target = 'http://192.168.0.170:6020';
// const target = 'http://192.168.0.121:6020';

export default {
  dev: {
    define: {
      APIURL: '', // 使用proxy代理 不配置
    },
    proxy: {
      '/admin': {
        target: target,
        changeOrigin: true,
      },
      '/user': {
        target: target,
        changeOrigin: true,
      },
      '/common': {
        target: target,
        changeOrigin: true,
      },
      '/media': {
        target,
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
