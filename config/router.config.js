export default [
  { path: '/', redirect: '/login/index' },
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: '登录',
        path: '/login/index',
        component: './Login/LoginForm',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/list',
      },
      {
        name: '城市运营中心',
        path: '/cityom',
        routes: [
          {
            path: '/cityom/list2',
            name: '合伙人列表',
            component: './User/UserList',
          },
          {
            path: '/cityom/list',
            name: '加盟申请',
            component: './User/UserList',
          },
        ],
      },
      {
        name: '用户管理',
        path: '/user',
        routes: [
          {
            path: '/user/list',
            name: '用户数据',
            component: './User/UserList',
          },
        ],
      },
      {
        name: '商户管理',
        path: '/business',
        routes: [
          {
            path: '/business/list',
            name: '商户数据',
            component: './Business/BusinessList',
          },
          {
            path: '/business/audit',
            name: '审核列表',
            component: './Business/BusinessAudit',
          },
          {
            path: '/business/brand',
            name: '品牌',
            component: './Business/BusinessBrand',
          },
        ],
      },
      {
        name: '营销管理',
        path: '/market',
        routes: [
          {
            path: '/market/cardpeaspark',
            name: '卡豆乐园',
            component: './Market/MarketCardPeasPark',
          },
          {
            path: '/market/activity',
            name: '营销活动',
            component: './Market/MarketCardActivity',
          },
        ],
      },
      {
        name: '圈层管理',
        path: '/circle',
        routes: [
          {
            path: '/circle/masterlist',
            name: '家主列表',
            component: './Circle/CircleMasterList',
          },
        ],
      },
      {
        name: '账户管理',
        path: '/account',
        routes: [
          {
            path: '/account/user',
            name: '用户账户',
            component: './Account/AccountUser',
          },
          {
            path: '/account/business',
            name: '商家账户',
            component: './Account/AccountBusiness',
          },
        ],
      },
      {
        name: '客服中心',
        path: '/service',
        routes: [
          {
            path: '/service/feedback',
            name: '问题反馈',
            component: './Service/ServiceFeedBack',
          },
        ],
      },
      {
        name: '系统设置',
        path: '/system',
        routes: [
          {
            path: '/system/appset',
            name: 'App设置',
            component: './System/SysAppList',
          },
          {
            path: '/system/tradeset',
            name: '行业设置',
            component: './System/SysTradeList',
          },
          {
            path: '/system/peasShare',
            name: '卡豆分享',
            component: './System/SysPeasShare',
          },
          {
            path: '/system/accountset',
            name: '帐号设置',
            component: './System/SysAccountList',
          },
          {
            path: '/system/pageset',
            name: '菜单设置',
            component: './System/SysMenuList',
          },
        ],
      },
    ],
  },
];
