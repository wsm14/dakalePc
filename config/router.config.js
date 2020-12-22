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
        name: '数据统计',
        path: '/chart',
        routes: [
          {
            path: '/chart/area',
            name: '区域战报',
            component: './Chart/AreaTotal',
          },
          {
            path: '/chart/block',
            name: '数据概况',
            component: './Chart/ChartBlock',
          },
        ],
      },
      {
        name: '加盟管理',
        path: '/cityom',
        routes: [
          {
            path: '/cityom/provCo',
            name: '省公司列表',
            component: './Cityom/ProvCompany',
            buttons: ['save', 'info', 'edit', 'status', 'relieve', 'income'],
          },
          {
            path: '/cityom/area',
            name: '区县运营中心',
            component: './Cityom/AreaCenter',
            buttons: ['save', 'info', 'edit', 'status', 'relieve', 'income', 'withdraw'],
          },
          {
            path: '/cityom/join',
            name: '加盟申请',
            component: './Cityom/FranchiseApplication',
            buttons: ['handle'],
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
            buttons: ['info', 'status'],
          },
          {
            path: '/user/master',
            name: '家主列表',
            component: './User/CircleMasterList',
            buttons: ['income'],
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
            buttons: ['checkDetail', 'check'],
          },
          {
            path: '/business/list',
            name: '店铺列表',
            component: './Business/BusinessList',
            buttons: [
              'save',
              'setMreCord',
              'exportList',
              'qrCode',
              'info',
              'status',
              'bussinessStatus',
              'edit',
              'set',
            ],
          },
          {
            path: '/business/group',
            name: '集团管理',
            component: './Business/GroupList',
            buttons: ['save', 'edit', 'info', 'activate'],
          },
          {
            path: '/business/settled',
            name: '入驻绑定查询',
            component: './Business/BusinessSettled',
            buttons: ['exportList'],
          },
        ],
      },
      {
        name: '店铺运营',
        path: '/operation',
        routes: [
          {
            path: '/operation/share',
            name: '分享管理',
            component: './Operation/ShareManage',
            buttons: ['down', 'info', 'handleDeatil'],
          },
          {
            path: '/operation/goods',
            name: '商品管理',
            component: './Operation/GoodsManage',
            buttons: ['save', 'info', 'stockSet', 'down', 'up', 'del', 'handleDeatil'],
          },
          {
            path: '/operation/classify',
            name: '分类管理',
            component: './Operation/ClassifyManage',
            buttons: ['save', 'edit', 'del'],
          },
          {
            path: '/operation/orders',
            name: '订单列表',
            component: './Operation/OrdersList',
            buttons: ['info'],
          },
          {
            path: '/operation/refund',
            name: '退款管理',
            component: './Operation/RefundOrder',
            buttons: ['info'],
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
          {
            path: '/expert/sort',
            name: '排序机制',
            component: './Expert/ExpertSort',
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
            component: './Market/AppSetList',
          },
          {
            path: '/market/special',
            name: '周边特惠',
            component: './Market/SpecialGoods',
          },
          {
            path: '/market/search',
            name: '搜索配置',
            component: './Market/SearchSetList',
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
