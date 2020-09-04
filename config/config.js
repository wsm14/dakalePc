// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './router.config';
import define from './env.config';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: false,
  history: { type: 'hash' },
  antd: {},
  dva: {
    hmr: true,
  },
  publicPath: './',
  locale: {
    // default zh-CN
    default: 'zh-CN',
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
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
});
