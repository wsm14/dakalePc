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
        path: '/chart',
        name: '数据统计',
        routes: [
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
            path: '/chart/userDataStat',
            name: '用户数据统计',
            component: './Chart/UserDataStat',
          },
          {
            path: '/chart/videoDataStat',
            name: '视频数据统计',
            component: './Chart/VideoDataStat',
          },
          {
            path: '/chart/orderDataStat',
            name: '订单数据统计',
            component: './Chart/OrderDataStat',
          },
          {
            path: '/chart/groupStatistics',
            name: '拼团统计',
            component: './Chart/GroupStatistics',
          },
          {
            path: '/chart/gameDataStat',
            name: '游戏数据统计',
            component: './Chart/GameDataStat',
          },
        ],
      },
      // 数据报表
      {
        name: '数据报表',
        path: '/dataStatement',
        routes: [
          {
            path: '/dataStatement/marketStatement',
            name: '销售报表',
            component: './DataStatement/MarketStatement',
          },
          {
            path: '/dataStatement/dataGatherExport',
            name: '数据明细查询',
            component: './DataStatement/DataGatherExport',
          },
          {
            path: '/dataStatement/achievementTotal',
            name: '哒人业绩统计',
            component: './DataStatement/ExpertUserAchievementTotal',
            buttons: ['exportList'],
          },
          {
            path: '/dataStatement/combineBuyAchievementTotal',
            name: '团购业绩',
            component: './DataStatement/CombineBuyAchievementTotal',
            buttons: ['exportList'],
          },
          {
            path: '/dataStatement/beanRedEnvelopes',
            name: '卡豆红包',
            component: './DataStatement/BeanRedEnvelopes',
            buttons: ['authEdit', 'getRecord', 'del'],
          },
          {
            path: '/dataStatement/assistance',
            name: '助力记录',
            component: './DataStatement/Assistance',
            buttons: ['assistanceInfo'],
          },
          {
            path: '/dataStatement/boxLottery',
            name: '盲盒抽奖记录',
            component: './DataStatement/BoxLottery',
            buttons: ['goodsDeliver', 'goodsView', 'exportList'],
          },
          {
            path: '/dataStatement/distribution',
            name: '哒人分销明细',
            component: './DataStatement/ExpertUserDistribution',
          },
        ],
      },

      {
        name: '营销管理',
        path: '/market',
        routes: [
          {
            path: '/market/platformEquity',
            name: '平台权益',
            component: './Market/PlatformEquity',
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
              'goodsCode',
              'shareImg',
            ],
          },
          {
            path: '/market/msg',
            name: '消息推送',
            component: './Market/MessagePush',
            buttons: ['userOs', 'mreOs', 'save', 'del', 'edit', 'eye', 'copy', 'push', 'revoke'],
          },
          {
            path: '/market/platformTicketManage',
            name: '平台券管理',
            component: './Market/PlatformTicketManage',
            buttons: ['addnum', 'info', 'edit', 'down', 'save', 'up'],
          },
          {
            path: '/market/spreeManage',
            name: '礼包管理',
            component: './Market/SpreeManage',
            buttons: ['addnum', 'info', 'edit', 'down', 'save', 'up', 'set', 'getRecord'],
          },
          {
            path: '/market/couponRulesManage',
            name: '券规则管理',
            component: './Market/CouponRulesManage',
            buttons: ['info', 'save', 'status', 'eye'],
          },
          {
            path: '/market/list',
            name: '活动列表',
            component: './Market/ActiveList',
            buttons: ['edit', 'copy', 'shareImg', 'del', 'activeTemplate'],
          },
          {
            path: '/market/addNewActivity',
            name: '拉新活动',
            component: './Market/AddNewActivity',
            buttons: [
              'save',
              'eye',
              'edit',
              'down',
              'data',
              'couponAdd',
              'destoryDetail',
              'orderDetail',
              'couponDetail',
            ],
          },
          {
            path: '/market/specialGoodsResource',
            name: '资源位配置',
            component: './Market/SpecialGoodsResource',
            buttons: ['cancleRecommend', 'configCondit'],
          },
          {
            path: '/market/openGroup',
            name: '开团列表',
            component: './Market/OpenGroupList',
            buttons: ['info', 'immediateGroup'],
          },
          {
            path: '/market/marketActivity',
            name: '营销活动',
            component: './Market/MarketActivity',
            buttons: ['save', 'info', 'edit', 'down', 'enrollGoods', 'copyLink', 'batchEditRule'],
          },
        ],
      },
      {
        name: '视频管理',
        path: '/video',
        routes: [
          {
            path: '/video/videoplatform',
            name: '商家视频',
            component: './Video/VideoPlatform',
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
              'information',
            ],
          },
          {
            path: '/video/videoplatformUGC',
            name: 'UGC视频',
            component: './Video/VideoPlatformUGC',
            buttons: [
              // 'save',
              'set',
              'del',
              'edit',
              'down',
              'info',
              'rewardPeo',
              'rewardInfo',
              'shareImg',
              'commerceSet',
              'portraitEdit',
              'information',
            ],
          },
          {
            path: '/video/videoCheck',
            name: '视频审核',
            component: './Video/VideoCheck',
            buttons: ['info', 'check', 'close'],
          },
          {
            path: '/video/advertisement',
            name: '广告投放管理',
            component: './Video/Advertisement',
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
              'rewardPeo',
              'peasDetail',
              'information',
            ],
          },
          {
            path: '/video/videoAd',
            name: '新手视频',
            component: './Video/NoviceAdvert',
            buttons: ['save', 'info', 'down', 'peasDetail', 'again', 'diary'],
          },
        ],
      },
      // 店铺管理 business
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
        ],
      },
      // 用户/哒人管理
      {
        path: '/user',
        name: '用户/哒人管理',
        routes: [
          {
            path: '/user/list',
            name: '用户数据',
            component: './User/UserList',
            buttons: ['info', 'status', 'couponInfo'],
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
          {
            path: '/user/uaerlist',
            name: '哒人列表',
            component: './User/ExpertUserList',
            buttons: ['status', 'recommendList', 'statistics', 'BDSet', 'diary', 'set'],
          },
          {
            path: '/user/trainee',
            name: '实习哒人设置',
            component: './User/ExpertTempList',
            buttons: ['save', 'cancelTemp'],
          },
        ],
      },
      // 哒小卡 daMarkCard
      {
        path: '/daMarkCard',
        name: '哒小卡管理',
        routes: [
          {
            path: '/daMarkCard/pointManage',
            name: '点位管理',
            component: './DaMarkCard/PointManage',
            buttons: ['point', 'award', 'advert', 'info', 'edit', 'signDetail', 'save', 'qrCode'],
          },
          {
            path: '/daMarkCard/pointCheck',
            name: '点位审核',
            component: './DaMarkCard/PointCheck',
            buttons: ['check', 'info'],
          },
        ],
      },
      // 财务管理
      {
        path: '/finance',
        name: '财务管理',
        routes: [
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
          {
            path: '/finance/user',
            name: '用户账户',
            component: './Finance/AccountUser',
            buttons: ['peasDetail', 'rechargeDetail'],
          },
          {
            path: '/finance/business',
            name: '商家账户',
            component: './Finance/AccountBusiness',
            buttons: ['peasDetail', 'withdraw', 'rechargeDetail'],
          },
          {
            path: '/finance/group',
            name: '集团账户',
            component: './Finance/AccountGroup',
            buttons: ['info'],
          },
          {
            path: '/finance/subsidyShop',
            name: '补贴店铺',
            component: './Finance/SubsidyShop',
            buttons: ['info'],
          },
        ],
      },
      // 加盟管理 cityom
      {
        path: '/cityom',
        name: '加盟管理',
        routes: [
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
          {
            path: '/cityom/areaQuery',
            name: '合伙查询系统',
            component: './Cityom/AreaQuery',
            buttons: ['set', 'edit'],
          },
        ],
      },

      // 基础信息 base
      {
        path: '/base',
        name: '基础信息',
        routes: [
          {
            path: '/base/account',
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
            path: '/base/tradeArea',
            name: '商圈管理',
            component: './Base/TradeArea',
            buttons: ['save', 'edit'],
          },
          {
            path: '/base/tradeset',
            name: '行业管理',
            component: './Base/TradeList',
            buttons: [
              'baseTrade',
              'tradeAdd',
              'del',
              'edit',
              'tradeSecondAdd',
              'isWechat',
              'isDelete',
            ],
          },
          {
            path: '/base/brand',
            name: '品牌管理',
            component: './Base/ManageBrand',
            buttons: ['save', 'del', 'edit', 'status'],
          },

          {
            path: '/base/tag',
            name: '店铺标签',
            component: './Base/TagManage',
            buttons: ['save', 'edit'],
          },
          {
            path: '/base/goodsTag',
            name: '商品标签',
            component: './Base/GoodsTag',
            buttons: ['save', 'edit', 'connectedGoods'],
          },
          {
            path: '/base/bankSet',
            name: '支行管理',
            component: './Base/ManageBank',
            buttons: ['save', 'edit'],
          },
          {
            path: '/base/peasShare',
            name: '卡豆分享',
            component: './Base/PeasShare',
            buttons: ['save', 'del', 'edit'],
          },
          {
            path: '/base/category',
            name: '商品类目管理 ',
            component: './Base/GoodsCategory',
            buttons: ['tradeAdd', 'del', 'edit', 'tradeSecondAdd', 'isDelete'],
          },
        ],
      },
      // 客服中心 service
      {
        path: '/service',
        name: '客服中心',
        routes: [
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
            path: '/service/faq',
            name: '常见问题',
            component: './Service/ServiceFAQ',
            buttons: [
              'userOs',
              'mreOs',
              'sortFAQ',
              'save',
              'del',
              'edit',
              'sort',
              'setLike',
              'status',
            ],
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
        ],
      },
      // 配置管理 system
      {
        name: '配置管理',
        path: '/system',
        routes: [
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
            buttons: [
              'adVideo_edit',
              'merchantVideo_edit',
              'UGCVideo_edit',
              'shareBean_edit',
              'goldVideo_edit',
              'holidaySave',
              'holidayDown',
              'holidayEdit',
              'holidayInfo',
              'iconEdit',
              'iconVersionEdit',
              'iconVersionDel',
              'iconVersionSave',
              'searchSet',
              'tabEdit',
              'tabEditVersion',
              'tabSaveVersion',
              'tabAddCity',
              'UGCSave',
              'UGCEdit',
              'UGCDown',
              'virtualSave',
              'virtualInfo',
              'virtualEdit',
            ],
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
            path: '/system/allocation',
            name: '哒人配置',
            component: './System/ExpertAllocation',
            buttons: ['save', 'edit'],
          },
          {
            path: '/system/walking',
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
          {
            path: '/system/markConfigure',
            name: '营销功能配置',
            component: './System/MarketConfigure',
            buttons: [
              'globalPopEdit',
              'globalUpVersion',
              'globalAddVersion',
              'globalPopAdd',
              'globalPopDel',
              'globalPopDown',
              'globalAddCity',
              'bannerEdit',
              'bannerUpVersion',
              'bannerAddVersion',
              'bannerDown',
              'bannerUp',
              'bannerDel',
              'bannerAdd',
              'bannerAddPlace',
              'floatEdit',
              'floatEditVersion',
              'floatAddVersion',
              'floatAddCity',
              'floatAdd',
              'floatDown',
              'floatDel',
              'newWelfareAdd',
              'newWelfareEdit',
              'weekEdit',
              'materialConfigDownLoad',
              'materialConfigAdd',
              'blindEdit',
              'blindDel',
              'blindAdd',
              'blindConfigEdit',
              'newWinDel',
              'newWinAdd',
              'groupGoodsConfigDel',
              'groupGoodsConfigAdd',
            ],
          },
        ],
      },
      // 商品/订单管理
      {
        path: '/operation',
        name: '商品/订单管理',
        routes: [
          {
            path: '/operation/electricGoods',
            name: '电商品',
            component: './Operation/ElectricGoods',
            buttons: ['save', 'info', 'down', 'edit', 'again', 'changeRemain', 'shareImg'],
          },
          {
            path: '/operation/orders',
            name: '订单列表',
            component: './Operation/OrdersList',
            buttons: ['info', 'exportList', 'goodsView', 'goodsDeliver', 'routing', 'batchRouting'],
          },
          {
            path: '/operation/ordersList',
            name: '订单列表(新)',
            component: './Operation/NewOrdersList',
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
            buttons: ['info', 'remark', 'payBack'],
          },
          {
            path: '/operation/refundList',
            name: '退款列表',
            component: './Operation/RefundList',
            buttons: ['info', 'remark', 'agree', 'refuse'],
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
            path: '/operation/special',
            name: '特惠商品',
            component: './Operation/SpecialGoods',
            buttons: [
              'save',
              'edit',
              'down',
              'info',
              'del',
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
        ],
      },
      // 供应链管理 SCM
      {
        path: '/SCM',
        name: '供应链管理',
        routes: [
          {
            path: '/SCM/supplierAuth',
            name: '供应链审核',
            component: './SCM/SupplierAuth',
            buttons: ['info', 'check'],
          },
          {
            path: '/SCM/supplierManage',
            name: '供应商列表',
            component: './SCM/SupplierManage',
            buttons: ['save', 'info', 'edit', 'activate', 'status', 'brand'],
          },
          {
            path: '/SCM/supplierSettlement',
            name: '结算明细',
            component: './SCM/SupplierSettlement',
            buttons: ['save', 'info', 'edit'],
          },
        ],
      },
      {
        name: '修改密码',
        path: '/password',
        component: './Base/PassWord',
      },
    ],
  },
];
