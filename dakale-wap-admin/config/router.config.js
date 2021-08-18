export default [
  { path: '/', redirect: '/login/index' },
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: '登录',
        path: '/login/index',
        component: './Logins/UserLogin',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/market/areaQuery',
        name: '合伙查询系统',
        component: './Market/AreaQuery',
        buttons: ['set', 'exportList'],
      },
    ],
  },
];
