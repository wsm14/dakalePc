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
        name: '数据统计',
        path: '/chart',
        routes: [
          {
            path: '/chart/area',
            name: '区域战报',
            component: './User/UserList',
            buttons: ['view', 'status'],
          },
          {
            path: '/chart/block',
            name: '数据概况',
            component: './User/CircleMasterList',
          },
        ],
      },
      {
        name: '加盟管理',
        path: '/cityom',
        routes: [
          {
            path: '/cityom/provCo',
            name: '省级公司',
            component: './CityOm/ProvCompany',
            button: ['view', 'update', 'save', 'status'],
          },
          {
            path: '/cityom/area',
            name: '区县运营中心',
            component: './CityOm/CityPartner',
          },
          {
            path: '/cityom/join',
            name: '加盟申请',
            component: './CityOm/FranchiseApplication',
          },
        ],
      },
      // {
      //   name: '活动设置',
      //   path: '/active',
      //   routes: [
      //     {
      //       path: '/active/template',
      //       name: '营销活动模版',
      //       component: './Active/ActiveTemplate',
      //     },
      //     {
      //       path: '/active/allocation',
      //       name: '活动配置',
      //       component: './Active/ActiveAllocation',
      //     },
      //     {
      //       path: '/active/list',
      //       name: '活动列表',
      //       component: './Active/ActiveList',
      //     },
      //     {
      //       path: '/active/param',
      //       name: '参数配置',
      //       component: './Active/ActiveParam',
      //     },
      //   ],
      // },
      {
        name: '用户管理',
        path: '/user',
        routes: [
          {
            path: '/user/list',
            name: '用户数据',
            component: './User/UserList',
            buttons: ['view', 'status'],
          },
          {
            path: '/user/master',
            name: '家主列表',
            component: './User/CircleMasterList',
          },
          {
            path: '/user/bdlimitPop',
            name: 'BD白名单',
            component: './User/BdLimitPop',
          },
        ],
      },
      {
        name: '店铺管理',
        path: '/business',
        routes: [
          {
            path: '/business/register',
            name: '注册列表',
            component: './Business/BusinessRegister',
          },
          {
            path: '/business/audit',
            name: '审核列表',
            component: './Business/BusinessAudit',
          },
          {
            path: '/business/list',
            name: '店铺数据',
            component: './Business/BusinessList',
          },
          {
            path: '/business/group',
            name: '集团管理',
            component: './Business/GroupList',
          },
          {
            path: '/business/share',
            name: '分享管理',
            component: './Business/ShareManage',
          },
          {
            path: '/business/goods',
            name: '商品管理',
            component: './Business/GoodsManage',
          },
          {
            path: '/business/classify',
            name: '分类管理',
            component: './Business/ClassifyManage',
          },
          {
            path: '/business/orders',
            name: '订单列表',
            component: './Business/OrdersList',
          },
          {
            path: '/business/refund',
            name: '退款管理',
            component: './Business/RefundOrder',
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
        ],
      },
      {
        name: '哒人管理',
        icon: 'expert',
        path: '/expert',
        routes: [
          {
            path: '/expert/recommend',
            name: '种草管理',
            component: './Expert/ExpertRecommend',
          },
          {
            path: '/expert/uaerlist',
            //business talent
            name: '哒人列表',
            component: './Expert/ExpertUserList',
          },
          {
            path: '/expert/level',
            name: '等级设置',
            component: './Expert/ExpertLevel',
          },
          {
            path: '/expert/set',
            name: '创作设置',
            component: './Expert/ExpertSet',
          },
        ],
      },
      {
        name: '营销管理',
        icon: 'market',
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
          {
            path: '/market/checkIn',
            name: '打卡设置',
            component: './Market/CheckInSet',
          },
          {
            path: '/market/appset',
            name: '广告管理',
            component: './market/AppSetList',
          },
        ],
      },
      {
        name: '账户管理',
        icon: 'account',
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
        icon: 'service',
        path: '/service',
        routes: [
          {
            path: '/service/news',
            name: '新闻动态',
            component: './Service/ServiceNews',
          },
          {
            path: '/service/feedback',
            name: '问题反馈',
            component: './Service/ServiceFeedBack',
          },
        ],
      },
      {
        name: '基础配置',
        icon: 'system',
        path: '/system',
        routes: [
          {
            path: '/system/account',
            name: '帐号权限管理',
            component: './System/AccountAdmin',
          },
          {
            path: '/system/provinceRole',
            name: '省公司角色管理',
            component: './System/RoleProvince',
          },
          {
            path: '/system/areaRole',
            name: '区县角色管理',
            component: './System/RoleArea',
          },
          {
            path: '/system/tradeArea',
            name: '商圈管理',
            component: './System/TradeArea',
          },
          {
            path: '/system/tradeset',
            name: '行业管理',
            component: './System/TradeList',
          },
          {
            path: '/system/brand',
            name: '品牌管理',
            component: './System/ManageBrand',
          },
          {
            path: '/system/bankSet',
            name: '支行管理',
            component: './System/ManageBank',
          },
          {
            path: '/system/peasShare',
            name: '卡豆分享',
            component: './System/PeasShare',
          },
          {
            path: '/system/pageset',
            name: '菜单设置',
            component: './System/MenuList',
          },
        ],
      },
      {
        name: '修改密码',
        path: '/password',
        component: './System/PassWord',
      },
    ],
  },
];
