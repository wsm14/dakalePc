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
        name: '城市运营中心',
        path: '/cityom',
        routes: [
          {
            path: '/cityom/provCo',
            name: '省级公司',
            component: './CityOm/ProvCompany',
          },
          {
            path: '/cityom/partner',
            name: '城市合伙人',
            component: './CityOm/CityPartner',
          },
          {
            path: '/cityom/join',
            name: '加盟申请',
            component: './CityOm/FranchiseApplication',
          },
        ],
      },
      {
        name: '修改密码',
        path: '/password',
        component: './System/SysPassWord',
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
            path: '/business/register',
            name: '注册列表',
            component: './Business/BusinessRegister',
          },
          {
            path: '/business/bankSet',
            name: '支行设置',
            component: './Business/BusinessBankSet',
          },
          {
            path: '/business/brand',
            name: '品牌',
            component: './Business/BusinessBrand',
          },
          {
            path: '/business/settled',
            name: '入驻查询',
            component: './Business/BusinessSettled',
          },
          {
            path: '/business/bindBank',
            name: '绑定查询',
            component: './Business/BusinessBindBank',
          },
          {
            path: '/business/excel',
            name: 'excel（临时）',
            component: './Business/BusinessExcelList',
          },
        ],
      },
      {
        name: '哒人管理',
        path: '/expert',
        routes: [
          {
            path: '/expert/uaerlist',
            name: '哒人列表',
            component: './Expert/ExpertUserList',
          },
          {
            path: '/expert/set',
            name: '创作设置',
            component: './Expert/ExpertSet',
          },
          {
            path: '/expert/level',
            name: '等级设置',
            component: './Expert/ExpertLevel',
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
          {
            path: '/service/news',
            name: '新闻动态',
            component: './Service/ServiceNews',
          },
          {
            path: '/service/businessVideo',
            name: '商户视频',
            component: './Service/ServiceBusinessVideo',
          },
          {
            path: '/service/limitPop',
            name: '人员排除',
            component: './Service/ServiceLimitPop',
          },
        ],
      },
      {
        name: '活动设置',
        path: '/active',
        routes: [
          {
            path: '/active/template',
            name: '活动模版',
            component: './Active/ActiveTemplate',
          },
          {
            path: '/active/allocation',
            name: '活动配置',
            component: './Active/ActiveAllocation',
          },
          {
            path: '/active/list',
            name: '活动列表',
            component: './Active/ActiveList',
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
            path: '/system/checkIn',
            name: '打卡设置',
            component: './System/SysCheckIn',
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
