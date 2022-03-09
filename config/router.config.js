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
      // 活动设置 active
      {
        path: '/active/template',
        name: '营销活动模版',
        component: './Active/ActiveTemplate',
      },
      {
        path: '/active/list',
        name: '活动列表',
        component: './Active/ActiveList',
        buttons: ['edit', 'copy', 'shareImg', 'del'],
      },
      {
        path: '/active/materialConfig',
        name: '营销物料配置',
        component: './Active/MaterialConfig',
        buttons: ['save', 'download'],
      },
      {
        path: '/active/assistance',
        name: '助力记录',
        component: './Active/Assistance',
        buttons: ['assistanceInfo'],
      },
      {
        path: '/active/prizeConfig',
        name: '抽奖配置',
        component: './Active/PrizeConfig',
        buttons: ['del', 'edit'],
      },
      {
        path: '/active/boxLottery',
        name: '盲盒抽奖记录',
        component: './Active/BoxLottery',
        buttons: ['goodsDeliver', 'goodsView', 'exportList'],
      },
      // 账户管理 account
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
      {
        path: '/account/group',
        name: '集团账户',
        component: './Account/AccountGroup',
        buttons: ['info'],
      },
      {
        path: '/account/subsidyShop',
        name: '补贴店铺',
        component: './Account/SubsidyShop',
        buttons: ['info'],
      },
      // 基础信息 base
      {
        path: '/system/account',
        name: '帐号权限管理',
        component: './Base/AccountAdmin',
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
        component: './Base/TradeArea',
        buttons: ['save', 'edit'],
      },
      {
        path: '/system/tradeset',
        name: '行业管理',
        component: './Base/TradeList',
        buttons: ['baseTrade', 'tradeAdd', 'del', 'edit', 'tradeSecondAdd', 'isWechat'],
      },
      {
        path: '/system/brand',
        name: '品牌管理',
        component: './Base/ManageBrand',
        buttons: ['save', 'del', 'edit', 'status'],
      },

      {
        path: '/system/tag',
        name: '店铺标签',
        component: './Base/TagManage',
        buttons: ['save', 'edit'],
      },
      {
        path: '/system/goodsTag',
        name: '商品标签',
        component: './Base/GoodsTag',
        buttons: ['save', 'edit'],
      },
      {
        path: '/system/bankSet',
        name: '支行管理',
        component: './Base/ManageBank',
        buttons: ['save', 'edit'],
      },
      {
        path: '/system/peasShare',
        name: '卡豆分享',
        component: './Base/PeasShare',
        buttons: ['save', 'del', 'edit'],
      },

      {
        name: '修改密码',
        path: '/password',
        component: './Base/PassWord',
      },
      // 店铺管理 business
      {
        path: '/business/register',
        name: '注册列表',
        component: './Business/BusinessRegister',
      },
      {
        path: '/business/bankChangeCheck',
        name: '银行卡变更审核',
        component: './Business/BankChangeCheck',
        buttons: ['info', 'check'],
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
          'edit',
          'info',
          'setMreCord',
          'exportList',
          'qrCode',
          'status',
          'bussinessStatus',
          'diary',
          'rate',
          'shareImg',
        ],
      },
      {
        path: '/business/group',
        name: '集团管理',
        component: './Business/GroupList',
        buttons: ['save', 'edit', 'info', 'activate', 'storeList', 'rate'],
      },
      {
        path: '/business/settled',
        name: '入驻绑定查询',
        component: './Business/BusinessSettled',
        buttons: ['exportList'],
      },
      // 数据统计 chart
      {
        path: '/chart/area',
        name: '区域战报',
        component: './Chart/AreaTotal',
      },
      {
        path: '/chart/sale',
        name: '运营数据',
        component: './Chart/SaleBlock',
      },
      {
        path: '/chart/block',
        name: '数据概况',
        component: './Chart/ChartBlock',
      },
      {
        path: '/chart/videoBoard',
        name: '视频看板',
        component: './Chart/VideoBoard',
      },
      {
        path: '/chart/dataGatherExport',
        name: '数据明细查询',
        component: './Chart/DataGatherExport',
      },
      // 加盟管理 cityom
      {
        path: '/cityom/provCo',
        name: '省公司列表',
        component: './Cityom/ProvCompany',
        buttons: ['save', 'edit', 'info', 'status', 'relieve'],
      },
      {
        path: '/cityom/cityCo',
        name: '市级公司',
        component: './Cityom/CityCompany',
        buttons: ['save', 'edit', 'info', 'status', 'relieve', 'set'],
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
      // 哒小卡 daMarkCard
      {
        path: '/daMarkCard/pointManage',
        name: '点位管理',
        component: './DaMarkCard/PointManage',
        buttons: ['point', 'award', 'advert', 'info', 'edit', 'signDetail', 'save', 'qrCode'],
      },
      // 哒人管理 expert
      {
        path: '/expert/uaerlist',
        name: '哒人列表',
        component: './Expert/ExpertUserList',
        buttons: ['status', 'recommendList', 'statistics', 'BDSet', 'diary', 'set'],
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
      {
        path: '/expert/achievementTotal',
        name: '哒人业绩统计',
        component: './Expert/ExpertUserAchievementTotal',
        buttons: ['exportList'],
      },
      {
        path: '/expert/combineBuyAchievementTotal',
        name: '团购业绩',
        component: './Expert/CombineBuyAchievementTotal',
        buttons: ['exportList'],
      },
      {
        path: '/expert/distribution',
        name: '哒人分销明细',
        component: './Expert/ExpertUserDistribution',
      },
      {
        path: '/expert/trainee',
        name: '实习豆长',
        component: './Expert/ExpertTempList',
        buttons: ['save', 'cancelTemp'],
      },
      // 财务管理 finance
      {
        path: '/finance/subsidy',
        name: '补贴管理',
        component: './Finance/SubsidyManage',
        buttons: [
          'task',
          'exportList',
          'taskSave',
          'taskDel',
          // 'taskEnd',
          'taskInfo',
          'taskDetail',
          'direct',
          'directSave',
          'directDel',
          // 'directEnd',
          'directInfo',
          'directDetail',
          'action',
          'actionSave',
          'actionDel',
          'actionEdit',
          'batchEdit',
          'recycleBean',
        ],
      },
      {
        path: '/finance/withdraw',
        name: '提现明细',
        component: './Finance/WithdrawDetail',
        buttons: [
          'edit',
          'exportList',
          'withdrawMerchant',
          'withdrawMerchantCash',
          'withdrawExpert',
          'withdrawAlliance',
          'withdrawGroup',
        ],
      },
      {
        path: '/finance/income',
        name: '平台收益',
        component: './Finance/PlatformIncome',
        buttons: ['exportList'],
      },
      {
        path: '/finance/withdrawAudit',
        name: '提现审核',
        component: './Finance/WithdrawAudit',
        buttons: ['info', 'check'],
      },
      // 广告营销 market
      {
        path: '/market/addNewActivity',
        name: '拉新活动',
        component: './Market/AddNewActivity',
        buttons: [
          'save',
          'eye',
          'edit',
          'down',
          'couponAdd',
          'destoryDetail',
          'orderDetail',
          'couponDetail',
        ],
      },
      {
        path: '/market/areaQuery',
        name: '合伙查询系统',
        component: './Market/AreaQuery',
        buttons: ['set', 'edit'],
      },

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
        path: '/market/advertisement',
        name: '广告投放管理',
        component: './Market/Advertisement',
        buttons: [
          'videoAd',
          'openAd',
          'puzzleAd',
          'save',
          'del',
          'edit',
          'set',
          'info',
          'up',
          'down',
          'adRoot',
          'rewardPeo',
          'peasDetail',
        ],
      },
      {
        path: '/market/appset',
        name: 'Banner管理',
        component: './Market/AppSetList',
        buttons: ['save', 'del', 'edit', 'up', 'down', 'addPlace'],
      },
      {
        path: '/market/markConfigure',
        name: '营销功能配置',
        component: './Market/MarketConfigure',
        buttons: ['save', 'del', 'edit', 'up', 'down'],
      },
      {
        path: '/market/videoAd',
        name: '新手视频',
        component: './Market/NoviceAdvert',
        buttons: ['save', 'info', 'down', 'peasDetail', 'again', 'diary'],
      },
      // 店铺运营 operation
      {
        path: '/operation/couponRulesManage',
        name: '券规则管理',
        component: './Operation/CouponRulesManage',
        buttons: ['info', 'save', 'status', 'eye'],
      },
      {
        path: '/operation/spreeManage',
        name: '礼包管理',
        component: './Operation/SpreeManage',
        buttons: ['addnum', 'info', 'edit', 'down', 'save', 'up', 'set', 'getRecord'],
      },
      {
        path: '/operation/platformTicketManage',
        name: '平台券管理',
        component: './Operation/PlatformTicketManage',
        buttons: ['addnum', 'info', 'edit', 'down', 'save', 'up'],
      },
      // 视频管理    video
      {
        path: '/operation/share',
        name: '视频管理',
        component: './Operation/ShareManage',
        buttons: ['save', 'info', 'down', 'check', 'diary', 'peasDetail', 'set', 'rewardPeo'],
      },
      {
        path: '/operation/videoplatform',
        name: '商家视频',
        component: './Operation/VideoPlatform',
        buttons: [
          'set',
          'save',
          'del',
          'edit',
          'down',
          'info',
          'rewardPeo',
          'shareImg',
          'commerceSet',
          'portraitEdit',
          'peasDetail',
        ],
      },
      {
        path: '/operation/videoplatformUGC',
        name: 'UGC视频',
        component: './Operation/VideoPlatformUGC',
        buttons: [
          // 'save',
          'set',
          'del',
          'edit',
          'down',
          'info',
          'rewardPeo',
          'rewardInfo',
          'config',
          'shareImg',
          'commerceSet',
          'portraitEdit',
        ],
      },
      {
        path: '/operation/videoCheck',
        name: '视频审核',
        component: './Operation/VideoCheck',
        buttons: ['info', 'check', 'close'],
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
        buttons: ['info', 'exportList', 'goodsView', 'goodsDeliver', 'routing', 'batchRouting'],
      },
      {
        path: '/operation/verificationList',
        name: '核销列表',
        component: './Operation/VerificationList',
        buttons: ['exportList'],
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
        buttons: [
          'save',
          'del',
          'info',
          'edit',
          'down',
          'again',
          'exportList',
          'diary',
          'addRemain',
          'shareImg',
          'getRecord',
        ],
      },
      {
        path: '/operation/platformEquity',
        name: '平台权益',
        component: './Operation/PlatformEquity',
        buttons: [
          'equityCoupon',
          'equityGoods',
          'equityCommerceGoods',
          'save',
          'edit',
          'down',
          'info',
          'givePrize',
          'again',
          'againUp',
          'addRemain',
          'diary',
        ],
      },
      {
        path: '/operation/platformEquityOrder',
        name: '权益订单',
        component: './Operation/PlatformEquityOrder',
        buttons: ['equityCoupon', 'equityGoods', 'equityDummy', 'info', 'exportList'],
      },
      {
        path: '/operation/special',
        name: '特惠商品',
        component: './Operation/SpecialGoods',
        buttons: [
          'save',
          'edit',
          'down',
          'info',
          'diary',
          'again',
          'recommendStatus',
          'exportList',
          'goodsCode',
          'againUp',
          'addRemain',
          'shareImg',
        ],
      },
      {
        path: '/operation/specialGoodCheck',
        name: '特惠商品审核',
        component: './Operation/SpecialGoodCheck',
        buttons: ['info', 'check', 'close'],
      },
      {
        path: '/operation/couponCheck',
        name: '券审核',
        component: './Operation/CouponCheck',
        buttons: ['info', 'check', 'close'],
      },
      {
        path: '/operation/specialGoodsResource',
        name: '资源位配置',
        component: './Operation/SpecialGoodsResource',
        buttons: ['cancleRecommend', 'configCondit'],
      },
      // 客服中心 service
      {
        path: '/service/news',
        name: '新闻动态',
        component: './Service/ServiceNews',
        buttons: ['save', 'edit', 'down'],
      },
      {
        path: '/service/userFollow',
        name: '用户跟进',
        component: './Service/UserFollow',
        buttons: ['save', 'edit', 'info', 'exportList', 'addTags'],
      },
      {
        path: '/service/feedback',
        name: '问题反馈',
        component: './Service/ServiceFeedBack',
        buttons: ['eye', 'replay', 'config'],
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
      {
        path: '/service/jobs',
        name: '人才招聘',
        component: './Service/SolicitJobs',
        buttons: ['save', 'edit', 'down', 'jobClass'],
      },
      {
        path: '/service/commentManage',
        name: '评论管理',
        component: './Service/CommentManage',
        buttons: ['del', 'recover'],
      },
      // 配置管理 system
      {
        path: '/system/city',
        name: '城市管理',
        component: './System/ManageCity',
        buttons: ['save', 'del', 'edit', 'status'],
      },
      {
        path: '/system/globalConfig',
        name: '全局配置',
        component: './System/GlobalConfig',
        buttons: ['down', 'edit', 'save', 'info'],
      },
      {
        path: '/system/pageset',
        name: '菜单设置',
        component: './System/MenuList',
      },
      {
        path: '/system/welfare',
        name: '新人福利配置',
        component: './System/WelfareConfig',
        buttons: ['edit', 'save', 'del'],
      },
      {
        path: '/expert/allocation',
        name: '哒人配置',
        component: './System/ExpertAllocation',
        buttons: ['save', 'edit'],
      },
      {
        path: '/market/search',
        name: '搜索配置',
        component: './System/SearchSetList',
        buttons: ['searchSet'],
      },
      {
        path: '/operation/walking',
        name: '逛逛页面配置',
        component: './System/WalkingManage',
      },
      {
        path: '/system/withdrawRegular',
        name: '提现规则',
        component: './System/WithdrawRegular',
        buttons: ['save', 'edit'],
      },
      {
        path: '/system/commissionTempate',
        name: '分佣模板',
        buttons: ['save', 'edit', 'info'],
        component: './System/CommissionTempate',
      },
      // 用户管理 user
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
      // 卡豆红包明细
      {
        path: '/redEnvelopes/beanRedEnvelopes',
        name: '卡豆红包',
        component: './RedEnvelopes/BeanRedEnvelopes',
        buttons: ['authEdit', 'getRecord', 'del'],
      },
    ],
  },
];
