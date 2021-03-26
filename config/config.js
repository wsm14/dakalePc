// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './router.config';
import define from './env.config';

const { REACT_APP_ENV, NODE_ENV } = process.env;

const externalsConfig =
  NODE_ENV === 'production'
    ? {
        externals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@ant-design/charts': 'window.charts',
        },
        scripts: [
          'https://unpkg.com/react@17.0.1/umd/react.production.min.js',
          'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
          'https://unpkg.com/@ant-design/charts@1.0.13/dist/charts.min.js',
        ],
      }
    : {};

export default defineConfig({
  hash: true,
  history: { type: 'hash' },
  esbuild: {},
  antd: {},
  dva: {
    hmr: true,
  },
  publicPath: './',
  locale: {
    // default zh-CN
    default: 'zh-CN',
  },
  lessLoader: { javascriptEnabled: true },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  extraBabelPlugins: [['import', { libraryName: '@ant-design/charts', libraryDirectory: 'lib' }]],
  chunks: ['vendors', 'umi'],
  chainWebpack: function (config, {}) {
    config.merge({
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 10,
            },
          },
        },
      },
    });
  },
  nodeModulesTransform: {
    type: 'none',
  },
  targets: {
    ie: 11,
    firefox: false,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: '/',
  },
  ...define[REACT_APP_ENV || 'dev'],
  // ...externalsConfig,
});
