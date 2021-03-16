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
      // 数据统计
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
      // 加盟管理
      {
        path: '/cityom/provCo',
        name: '省公司列表',
        component: './Cityom/ProvCompany',
        buttons: ['save', 'edit', 'info', 'status', 'relieve'],
      },
      {
        path: '/cityom/area',
        name: '区县运营中心',
        component: './Cityom/AreaCenter',
        buttons: ['save', 'edit', 'info', 'status', 'relieve'],
      },
      {
        path: '/cityom/join',
        name: '加盟申请',
        component: './Cityom/FranchiseApplication',
        buttons: ['info', 'handle'],
      },
      {
        path: '/cityom/sale',
        name: '销售系统管理',
        component: './Cityom/SaleAccount',
        buttons: ['save', 'edit', 'info', 'status', 'relieve'],
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
      // 用户管理
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
        buttons: ['save'],
      },
      // 店铺管理
      {
        path: '/business/register',
        name: '注册列表',
        component: './Business/BusinessRegister',
      },
      {
        path: '/business/audit',
        name: '新店审核',
        component: './Business/BusinessAudit',
        buttons: ['checkDetail', 'check'],
      },
      {
        path: '/business/list',
        name: '店铺列表',
        component: './Business/BusinessList',
        buttons: [
          'save',
          'edit',
          'info',
          'setMreCord',
          'exportList',
          'qrCode',
          'status',
          'bussinessStatus',
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
      // 财务管理
      {
        path: '/finance/subsidy',
        name: '补贴管理',
        component: './Finance/SubsidyManage',
        buttons: [
          'task',
          'exportList',
          'taskSave',
          'taskInfo',
          'taskDel',
          'taskEnd',
          'action',
          'actionSave',
          'actionDel',
          'actionEdit',
        ],
      },
      {
        path: '/finance/withdraw',
        name: '提现明细',
        component: './Finance/WithdrawDetail',
        buttons: ['edit', 'exportList'],
      },
      {
        path: '/finance/income',
        name: '平台收益',
        component: './Finance/PlatformIncome',
        buttons: ['exportList'],
      },
      // 店铺运营
      {
        path: '/operation/share',
        name: '分享管理',
        component: './Operation/ShareManage',
        buttons: ['save', 'del', 'edit', 'info', 'down', 'signDetail', 'handleDeatil'],
      },
      {
        path: '/operation/goods',
        name: '商品管理',
        component: './Operation/GoodsManage',
        buttons: ['save', 'del', 'info', 'down', 'up', 'stockSet', 'handleDeatil'],
      },
      {
        path: '/operation/classify',
        name: '分类管理',
        component: './Operation/ClassifyManage',
        buttons: ['save', 'del', 'edit'],
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
      {
        path: '/operation/coupon',
        name: '优惠券管理',
        component: './Operation/CouponManage',
        buttons: ['info', 'down'],
      },
      {
        path: '/operation/special',
        name: '周边特惠',
        component: './Operation/SpecialGoods',
        buttons: ['down', 'recommendStatus', 'tradeSet'],
      },
      {
        path: '/operation/walking',
        name: '逛逛页面配置',
        component: './Operation/WalkingManage',
      },
      {
        path: '/operation/preferential',
        name: '逛逛页面配置',
        component: './Operation/PreferentialActive',
      },
      // 哒人管理
      {
        path: '/expert/uaerlist',
        name: '哒人列表',
        component: './Expert/ExpertUserList',
        buttons: ['status'],
      },
      {
        path: '/expert/level',
        name: '等级设置',
        component: './Expert/ExpertLevel',
        buttons: ['targetSet', 'rightsSet'],
      },
      {
        path: '/expert/set',
        name: '创作设置',
        component: './Expert/ExpertSet',
        buttons: ['del', 'edit', 'status', 'topic', 'savePClassify', 'saveClassify'],
      },
      {
        path: '/expert/sort',
        name: '排序机制',
        component: './Expert/ExpertSort',
        buttons: ['edit'],
      },
      {
        path: '/expert/recommend',
        name: '哒人种草',
        component: './Expert/ExpertRecommend',
        buttons: ['info', 'down', 'handle', 'reportCenter'],
      },
      // 营销管理
      {
        path: '/market/cardpeaspark',
        name: '卡豆乐园',
        component: './Market/MarketCardPeasPark',
        buttons: ['set', 'noticeAdd', 'noticeEdit', 'noticeDel', 'noticeSend'],
      },
      {
        path: '/market/activity',
        name: '营销活动',
        component: './Market/MarketCardActivity',
        buttons: [
          'save',
          'eye',
          'down',
          'couponAdd',
          'destoryDetail',
          'orderDetail',
          'couponDetail',
        ],
      },
      {
        path: '/market/checkIn',
        name: '打卡设置',
        component: './Market/CheckInSet',
        buttons: [
          'edit',
          'shareImg',
          'shareImgEdit',
          'shareText',
          'shareImgAdd',
          'shareTextEdit',
          'markImg',
          'markTextAdd',
          'markImgEdit',
          'markText',
          'markTextEdit',
        ],
      },
      {
        path: '/market/appset',
        name: '广告管理',
        component: './Market/AppSetList',
        buttons: ['save', 'del', 'edit', 'down'],
      },
      {
        path: '/market/search',
        name: '搜索配置',
        component: './Market/SearchSetList',
        buttons: ['searchSet'],
      },
      {
        path: '/market/puzzleAd',
        name: '拼图广告',
        component: './Market/PuzzleAd',
        buttons: ['save', 'del', 'edit', 'eye', 'up', 'down'],
      },
      // 账户管理
      {
        path: '/account/user',
        name: '用户账户',
        component: './Account/AccountUser',
        buttons: ['peasDetail', 'rechargeDetail'],
      },
      {
        path: '/account/business',
        name: '商家账户',
        component: './Account/AccountBusiness',
        buttons: ['peasDetail', 'withdraw', 'rechargeDetail'],
      },
      // 客服中心
      {
        path: '/service/news',
        name: '新闻动态',
        component: './Service/ServiceNews',
        buttons: ['save', 'down'],
      },
      {
        path: '/service/feedback',
        name: '问题反馈',
        component: './Service/ServiceFeedBack',
        buttons: ['eye', 'replay'],
      },
      {
        path: '/service/msg',
        name: '消息推送',
        component: './Service/MessagePush',
        buttons: ['userOs', 'mreOs', 'save', 'del', 'edit', 'eye', 'copy', 'push', 'revoke'],
      },
      {
        path: '/service/faq',
        name: '常见问题',
        component: './Service/ServiceFAQ',
        buttons: ['userOs', 'mreOs', 'sortFAQ', 'save', 'del', 'edit', 'sort', 'setLike', 'status'],
      },
      // 基础配置
      {
        path: '/system/account',
        name: '帐号权限管理',
        component: './System/AccountAdmin',
        buttons: [
          'user',
          'userAdd',
          'userStatus',
          'userEdit',
          'role',
          'roleAdd',
          'roleStatus',
          'roleEdit',
          'section',
        ],
      },
      {
        path: '/system/tradeArea',
        name: '商圈管理',
        component: './System/TradeArea',
        buttons: ['save', 'edit'],
      },
      {
        path: '/system/tradeset',
        name: '行业管理',
        component: './System/TradeList',
        buttons: ['baseTrade', 'tradeAdd', 'del', 'edit', 'tradeSecondAdd'],
      },
      {
        path: '/system/brand',
        name: '品牌管理',
        component: './System/ManageBrand',
        buttons: ['save', 'del', 'edit', 'status'],
      },
      {
        path: '/system/tag',
        name: '店铺标签',
        component: './System/TagManage',
        buttons: ['save', 'edit'],
      },
      {
        path: '/system/city',
        name: '城市管理',
        component: './System/ManageCity',
        buttons: ['save', 'del', 'edit', 'status'],
      },
      {
        path: '/system/bankSet',
        name: '支行管理',
        component: './System/ManageBank',
        buttons: ['save', 'edit'],
      },
      {
        path: '/system/peasShare',
        name: '卡豆分享',
        component: './System/PeasShare',
        buttons: ['save', 'del', 'edit'],
      },
      {
        path: '/system/pageset',
        name: '菜单设置',
        component: './System/MenuList',
      },
      {
        name: '修改密码',
        path: '/password',
        component: './System/PassWord',
      },
    ],
  },
];
