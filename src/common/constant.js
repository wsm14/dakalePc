import appLogo from '@public/app.jpg';
import wechatLogo from '@public/wechat.png';

/**
 * 统一参数配置
 */

// 登录权限key
export const AUTH_SECRET_KEY = '733828mtizndu2cshfp1468889281801r9uv0aaji10';

// 高德地图map key
export const AMAP_KEY = 'b71a4bfb0ccc175459fdadf06cb0b1b7';

// 高德地图js key
export const AMAP_JS_KEY = 'ebb2511fda31f6cbf5c5c9a5d7e84e39';

// 排序纬度
export const EXPERT_SORT_TYPE = {
  beanReward: '卡豆打赏额',
  likes: '点赞数',
  collections: '收藏数',
  shares: '分享数',
  finished: '完播数',
  views: '浏览量',
  level: '哒人等级',
  quantity: '带货量',
  noviceProtection: '新手保护',
};
// 小程序-weChat APP-app
export const ORDER_PAY_LOGO = {
  weChat: wechatLogo,
  app: appLogo,
};

// 订单支付类型
export const PAY_TYPE = {
  beanPay: '卡豆支付',
  wechat: '微信支付',
  alipay: '支付宝支付',
  wx_lite: '小程序支付',
  // wx_lite: '微信小程序',
  JSAPI: '微信支付',
  couponPay: '券支付',
  APP: 'APP支付',
  apple_pay: '苹果支付',
  balancePay: '余额支付',
};

// 导出excel枚举
export const EXPORT_TYPE = {
  darenList: '哒人列表',
  userRegistration: '用户注册明细',
  merchantMark: '到店打卡明细',
  communityGoodsStatistic: '团购商品统计',
};

// 导出excel枚举 - 列表枚举映射
export const EXPORT_LIST_TYPE = {
  momentCollarBean: '视频领豆明细',
  verificationList: '核销列表',
  performanceStatistics: '团购业绩统计',
  darenPerformanceStatistics: '哒人业绩统计',
};

// 数据概况 - 营业数据相关 - GMV等type
export const GMV_DATA_TYPE = {
  scan: '扫码订单',
  topUp: '充值订单',
  specialGoods: '特惠商品',
  reduceCoupon: '有价券',
  communityGoods: '团购商品',
  virtualProduct: '虚拟商品',
  rightGoods: '权益商品',
  rightCoupon: '权益券',
  commerceGoods: '电商商品',
  expiredOrder: '过期不可退',
};

// 提现状态
export const WITHDRAW_STATUS = [false, '发起提现', '处理中', '成功', '失败'];

// 加盟商提现平台类型
export const WITHDRAW_ALLIANCE_TYPE = {
  city: '市级提现',
  partner: '区县提现',
};

// 反馈状态
export const FEEDBACK_STATUS = [false, '处理中', '已解答'];

// 用户状态
export const ACCOUNT_STATUS = ['禁用', '正常', '已注销'];

// 实名状态
export const REAL_NAME_STATUS = ['未实名', '认证中', '已经实名', '审核拒绝'];

// 城市管理 -  状态
export const CITY_STATUS = ['未开通', '已开通'];

// 店铺 营业状态
export const BUSINESS_DO_STATUS = ['暂停营业', '营业'];

// 店铺 账户状态(银行卡绑定状态)
export const BUSINESS_ACCOUNT_STATUS = [false, false, '未激活', '已激活'];

// 店铺 账户激活状态
export const MRE_ACCOUNT_STATUS = ['未绑定', '审核中', '绑定失败', '绑定成功'];

// 店铺 绑定激活查询排序
export const MRE_SORT_STATUS = ['提交审核时间倒序', '按审核时间倒序', '按绑卡时间倒序'];

// 店铺 店铺状态
export const BUSINESS_STATUS = ['禁用', '启用'];

// 店铺 类型
export const BUSINESS_TYPE = { merchant: '单店', group: '集团' };

// 店铺 审核状态 '待审核', '审核中', '审核驳回', '审核通过'
export const BUSINESS_STATUS_AUDIT = ['待审核', '审核中', '审核驳回', '审核通过'];

// 店铺 审核记录状态 '审核通过', '审核驳回'
export const BUSINESS_DETAIL_AUDIT = ['审核通过', '审核驳回'];

// 店铺 注册列表 状态
export const BUSINESS_REGISTER_STATUS = ['已注册', '已入驻', '未激活', '已激活'];

// 挑战赛状态
export const MATCH_STATUS = ['已取消', '等待揭晓', '已结束'];

// 用户挑战赛状态
export const MATCH_USER_STATUS = ['已取消', '已报名', '已完成', '已领奖'];

// 哒人状态
export const EXPERT_USER_TYPE = ['封停', '正常'];

// 哒人封停状态
export const EXPERT_USER_STATUS = ['永久封停', '正常', '封停1天', '封停1周', '封停1月'];

// 哒人类型
export const EXPERT_TYPE = { normal: '用户', daren: '哒人', douzhang: '豆长' };

// 哒人提现规则
export const EXPERT_IS_WITHDRAW = ['不可提现', '可提现'];

// 哒人类型
export const EXPERT_LIST_TYPE = { daren: '哒人', douzhang: '豆长' };

// 实习豆长状态
export const EXPERT_TEMP_STATUS = ['未开始', '实习中', '实习结束'];

// 哒小团提现状态
export const COMMUNITY_WITHDRAW_STATUS = ['待审核', '已审核'];

// 活动状态
export const ACTIVITY_STATUS = ['待开始', '进行中', '已下架'];

// 电商商品状态
export const COMMERCEGOODS_STATUS = ['已下架', '活动中', '即将开始'];

// 新人下单配置福利状态
export const WELFARE_STATUS = ['未开始', '进行中', '已结束'];

// 提现状态
export const COLLECT_STATUS = [false, '发起提现', '处理中', '成功', '失败'];

// 卡券状态
export const ACTIVE_COUPON_STATUS = ['未使用', '已过期', '已核销'];

// 卡豆乐园 公告状态
export const MARKET_NOTICE_STATUS = ['待发布', '已发布'];

// 新闻动态状态
export const NEWS_STATUS = ['已发布', '已下架', '草稿'];

// 拼图广告状态
export const PUZZLE_AD_STATUS = ['下架', '上架'];

// 分享状态 0-待审核；1-审核通过 2-审核拒绝 3-下架 4-删除 5-分享结束 6-预发布
export const SHARE_STATUS = [
  '待审核',
  '已上架',
  '审核拒绝',
  '已下架',
  '已删除',
  '分享结束',
  '即将发布',
];

// 核销状态 0：未核销，1：已核销 2：已过期 3-申请退款中 4-关闭
export const VERIFICATION_STATUS = ['未核销', '已核销', '已过期', '申请退款中', '关闭'];

// 种草状态 0-待审核；1-审核通过 2-审核拒绝 3-下架 4-删除 5-分享完成
export const RECOMMEND_STATUS = [false, '审核通过', false, '下架', '删除', '分享完成'];

// 商品状态 0-已下架 1-上架中 2-预售 3-未发布
export const GOODS_TYPE = ['已下架', '上架中', false, '未发布'];

// 店铺确认状态
export const MRE_SURE_TYPE = ['已驳回', '确认中', '已确认'];

// 店铺售罄状态
export const MRE_STOCK_STATUS = ['已售罄', '未售罄'];

// 员工在职状态
export const WORKER_JOB_TYPE = ['离职', '在职'];

// 广告管理 - 展示状态
export const BANNER_SHOW_STATUS = ['已下架', '展示中', '即将开始'];

// 广告管理 - 投放区域类型
export const BANNER_AREA_TYPE = { all: '全平台', detail: '省市区' };

// 广告管理 - 可见范围
export const BANNER_LOOK_AREA = {
  'user,kol': '全部',
  kol: '仅哒人可见',
  user: '仅用户可见',
};

// 全局弹窗配置 - 弹窗频率
export const MODAL_FREQUENCY = { day: '每天一次', times: '每次进入页面', only: '仅弹一次' };

// 全局弹窗配置 - 弹窗类型
export const MARKET_MODAL_TYPE = { image: '图片', url: '链接' };

// 全局弹窗配置 - 活动状态
export const MARKET_STATUS_TYPE = ['即将开始', '展示中', '已结束'];

//全局弹窗配置 - 跳转类型
export const MARKET_JUMP_TYPE = {
  '': '无',
  h5: 'H5',
  native: '原生页面',
  template: '跳转模板内容',
};

// 全局弹窗配置 - 可见范围
export const MARKET_LOOK_AREA = {
  all: '全部',
  kol: '仅哒人可见',
  user: '仅用户可见',
};

// 新人福利弹窗 - 活动状态
export const NEWUSER_STATUS_TYPE = ['即将开始', '上架中', '已结束'];

// 周边特惠 - 上架状态 0-已下架 1-活动中 2-即将开始 3-审核中 4-未通过
// export const SPECIAL_STATUS = ['已下架', '活动中', '即将开始', '审核中', '未通过'];
export const SPECIAL_STATUS = ['已下架', '活动中'];

// 店铺标签状态
export const MRE_TAG_STATUS = ['停用', '启用'];

// FAQ猜你想问
export const FAQ_LIKE_STATUS = ['未设置', '已设置'];

// FAQ端口类型
export const FAQ_PART_TYPE = { user: '用户端', merchant: '商家端' };

// 省代/区县公司/销售管理系统状态
export const COMPANY_PROV_STATUS = ['正常', '冻结', '解约'];

// 订单状态
export const ORDERS_STATUS = [
  '待支付',
  '待核销',
  '订单关闭',
  '交易完成',
  '已确认',
  '预支付',
  '退款中',
  '已过期',
];

// 游戏类型名称
export const GAME_TYPE_NAME = {
  mark: '哒小卡中奖',
  gameSign: '签到游戏',
  gameFree: '免费领商品游戏',
  gameGather: '集碎片游戏',
  gameFarm: '卡豆农场',
  dailyLuckDraw: '天天抽奖',
  taskPrize: '任务奖励',
};

// 电商订单状态
export const COMMERCE_ORDERS_STATUS = [
  '待支付',
  '待发货',
  '已退款',
  '已完成',
  '',
  '',
  '',
  '',
  '已发货',
];

// 订单关闭状态 ---原来的“已关闭”状态 ORDERS_STATUS 进行了拆分：
export const ORDER_CLOSE_TYPE = {
  unpaidExpiredCancel: '待付款超时自动关闭',
  unpaidManualCancel: '订单已取消',
  expiredRefund: '订单已过期，订单自动过期', //过期退款
  manualRefund: '已退款成功，申请退款成功', // 手动退款
};

// 退款订单状态
export const REFUND_ORDERS_STATUS = ['退款中', '已退款', '取消退款'];

// 哒人带货 订单状态
export const EXPRET_DISTRIBUTION_STATUS = ['待分佣', '已分佣', false, false, '已退款'];

// 哒人带货 订单对应状态
export const EXPRET_DISTRIBUTION_PAY_STATUS = ['付款', '核销', false, false, '退款'];

// 用户来源
export const USER_SOURCE = {
  weChat: '小程序',
  app: 'APP',
  communityWeChat: '哒小团',
  markWeChat: '哒小卡',
};

// 合作意向类型
export const FRANCHISE_COOPERATION_TYPE = {
  company: '省公司',
  city: '市级代理',
  partner: '区县代理',
};

// 分享类型
export const PUZZLE_AD_TYPE = { video: '视频', image: '图片' };

// 消息推送 - 推送状态
export const MSG_PSUH_STATUS = ['未推送', '推送中', '推送成功', '推送已撤销'];

// 人才招聘 - 状态
export const JSOBS_STATUS = ['草稿', '已发布', '下架'];

// 人才招聘 - 学历
export const EDUCATION_JSOBS_STATUS = {
  不限: '不限',
  初中及以下: '初中及以下',
  '中专/中技': '中专/中技',
  高中: '高中',
  大专: '大专',
  本科: '本科',
  硕士: '硕士',
  博士: '博士',
};

// 用户性别
export const SEX_NEW_TYPE = { M: '男', F: '女' };

// 销售管理系统 - 类型
export const SALE_ACCOUNT_TYPE = { province: '省份', city: '城市', district: '区县' };

// 消息推送 - 推送目标
export const MSG_PSUH_TAB = { user: '用户端', merchant: '商家端' };

// 消息推送 - 消息类型
export const MSG_PSUH_TYPE = { official: '官方消息', system: '系统消息' };

// 消息推送 - 推送对象, specific: '指定用户', group: '用户群体'
export const MSG_PSUH_OBJECT = { all: '全部用户', specific: '指定用户' };

// 消息推送 - 跳转类型
export const MSG_PSUH_URL = { '': '无', h5: 'H5', native: '原生' };

// 补贴管理 补贴类型
export const SUBSIDY_TYPE = {
  platform: '营销卡豆',
  directCharge: '平台直充',
  // recycleDirectCharge: '平台直充回收',
  // recyclePlatform: '营销卡豆回收',
  platformSubsidy: '平台补贴',
  pushVideo: '打赏补贴',
  momentStop: '打赏回收',
  watchMoment: '看分享',
  beanGame: '卡豆游戏',
};

// 补贴管理 补贴卡豆类型
export const SUBSIDY_BEAN_TYPE = { out: '补贴', in: '回收' };

// 补贴管理 任务列表 补贴角色
export const SUBSIDY_TASK_ROLE = {
  user: '用户',
  merchant: '店铺',
  group: '集团',
  brand: '品牌',
  city: '市级代理',
  partner: '区县代理',
};

// 补贴管理 行为管理 补贴角色
export const SUBSIDY_ACTION_ROLE = { user: '用户', merchant: '店铺', group: '集团', brand: '品牌' };

// 补贴管理 行为管理 补贴角色
export const SUBSIDY_ACTION_ROLES = { user: '哒人', merchant: '店铺', group: '集团' };

// 补贴管理 行为管理 补贴类型 列表映射
export const SUBSIDY_ACTION_TYPE = {
  video: '发布视频',
  image: '发布图文',
  mark: '到店打卡',
  newcomer: '新人核销',
};

// 补贴管理 行为管理 补贴类型 表单映射
export const SUBSIDY_ACTION_TYPE_FORM = {
  merchant: {
    video: '发布视频',
    image: '发布图文',
    mark: '到店打卡',
  },
  user: {
    newcomer: '新人核销',
  },
};

// 分享类型
export const SHARE_TYPE = { video: '视频', image: '图文' };

// 订单类型
export const ORDERS_TYPE = {
  // kolGoods: '哒人带货',
  specialGoods: '周边特惠',
  reduceCoupon: '抵扣券订单',
  // marketCoupon: '兑换券订单',
  rightGoods: '权益商品订单',
  rightCoupon: '权益券订单',
};

// 平台收益订单类型
export const PLATFORM_INCOME_ORDERS_TYPE = {
  scan: '扫码订单',
  writeOff: '核销订单',
  expiredOrder: '过期不可退订单',
};

// 账户激活状态
export const GROUP_BANK_STATUS = ['未激活', '审核中', '激活失败', '激活成功'];

// 开屏广告端口
export const OPEN_ADVERT_PORT = { user: '用户端', merchant: '商家端' };

// 开屏广告 - 类型
export const OPEN_ADVERT_TYPE = { image: '图片广告', video: '视频广告' };

// 开屏广告 - 状态
export const OPEN_ADVERT_STATUS = ['待展示', '展示中', '已下架'];

// Banner端口
export const BANNER_PORT_TYPE = {
  user: '用户端',
  merchant: '商家端',
  weChat: '微信小程序',
  mark: '哒小卡小程序',
  communityWechat: '哒小团小程序',
};

const bannerType = {
  person: '个人',
  hotWeal: '爆品福利',
  dayPush: '每日必推',
  todayNew: '今日上新',
  beanSelection: '小豆精选',
  nearbyBusinessHub: '附近商圈',
  popularityRanking: '人气排行榜',
  wanderAroundCapsule: '逛逛胶囊位',
  highCommissionAlliance: '高佣联盟',
  wanderAroundMainBanner: '逛逛主Banner',
  wanderAroundGoodMerchant: '逛逛周边好店',
  wanderAroundRecharge: '逛逛话费充值',
  wanderAroundBean: '逛逛卡豆专区',
  markMain: '哒卡主页',
  marketingActivities: '营销活动',
};

// Banner类型
export const BANNER_PORT_LINK = {
  user: bannerType,
  weChat: bannerType,
  merchant: {
    merchantMain: '商家工作台',
  },
  mark: {
    markMain: '哒卡主页',
  },
};

// Banner跳转类型
export const BANNER_JUMP_TYPE = { '': '无', h5: 'H5', native: '原生页面' };

// 用户类型
export const MASTER_TYPE = { user: '用户', merchant: '店铺' };

// 商品类型
export const GOODS_CLASS_TYPE = { single: '单品', package: '套餐' };

// 风向标跳转类型
export const VANE_URL_TYPE = {
  h5: '跳转至URL',
  trade: '按行业显示',
  native: '原生页面',
  template: '跳转模板内容',
};

// 分享设置 - 区域类型
export const SHARE_AREA_TYPE = {
  all: '全国',
  city: '按市选择',
  district: '按区县选择',
  near: '按附近区域',
};

// 分享设置 - 兴趣标签选择
export const SHARE_TASTE_TYPE = { all: '不限', tag: '选择兴趣标签' };

// 分享设置 - 性别
export const SHARE_SEX_TYPE = { ALL: '不限', M: '男', F: '女' };

// 分享设置 - 年龄
export const SHARE_AGE_TYPE = { '0-100': '不限', age: '选择年龄段(可多选)' };

// 分享设置 - 时间设置类型
export const SHARE_TIME_TYPE = ['扣完为止', '固定时间'];

// 优惠券管理 - 优惠券状态
export const COUPON_STATUS = [false, '上架中', '已下架'];

// 优惠券管理 - 免费券领取核销记录 - 状态
export const FREE_COUPON_STATUS = ['未使用', '已过期', '已核销', '关闭'];

// 优惠券管理 - 免费券领取核销记录 - 场景
export const FREE_COUPON_SCENE = {
  moment: '视频',
  consume: '消费',
  mark: '打卡',
};

// 优惠券管理 - 优惠券类型
export const COUPON_TYPE = { exchange: '兑换券', reduce: '抵扣券' };

// 优惠券管理 - 是否售卖
export const COUPON_BUY_FLAG = ['关闭', '开启'];

// 优惠券管理 - 适用时段
export const COUPON_USER_TIME = { '1,2,3,4,5,6,7': '每天', part: '部分' };

// 优惠券管理 - 星期时间段
export const COUPON_WEEK_TIME = [false, '周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// 优惠券管理 - 时间段选择
export const COUPON_TIME_TYPE = { '00:00-23:59': '全天', part: '固定时间' };

// 优惠券管理 - 购买规则
export const COUPON_BUY_RULE = { unlimited: '不限', personLimit: '每人限制', dayLimit: '每天限制' };
// 优惠券管理 - 发送方式
export const COUPON_GIVE_TYPE = {
  manual: '手动领取',
  auto: '自动发放',
  system: '系统发放',
};

// 优惠券管理 - 优惠券类型
export const COUPON_ACTIVE_TYPE = { fixed: '固定时间', infinite: '长期' };

// 收入/支出
export const ADD_AND_MINUS = { add: '收入', minus: '支出' };

// specialGoods-特惠商品 reduceCoupon-优惠券
export const ORDER_TYPE_PROPS = {
  specialGoods: '特惠商品',
  reduceCoupon: '优惠券',
  scan: '扫码',
  rightGoods: '权益商品',
  rightCoupon: '权益券',
  virtualProduct: '虚拟商品',
  communityGoods: '团购商品',
  commerceGoods: '电商商品',
  communityGoods: '团购商品',
};

export const ORDER_ORDERTYPE = {
  specialGoods: '特惠商品',
  reduceCoupon: '优惠券',
};

// 哒人核销订单类型
export const EXPRET_DISTRIBUTION_TYPE = {
  scan: '扫码支付',
  specialGoods: '周边特惠',
  reduceCoupon: '抵扣券订单',
};

// 哒人核销是否自购类型
export const EXPRET_DISTRIBUTION_OWN_TYPE = { self: '自购', share: '直推' };

// 特惠活动 - 使用时间
export const SPECIAL_USERTIME_TYPE = { fixed: '固定时间', gain: '领取后' };

// 特惠活动 - 热销推荐
export const SPECIAL_RECOMMEND_TYPE = {
  hot: '限时抢购',
  today: '爆品福利',
  thisPeriod: '本期必抢',
  nextPeriod: '下期预告',
  novice: '新手视频',
  dayPush: '每日必推',
  aroundSpecial: '特惠推荐',
  selfTour: '自我游',
  newProductRecommend: '新品推荐',
};

// 特惠活动 - 是否删除
export const SPECIAL_RECOMMEND_DELSTATUS = ['已删除', '未删除'];

// 特惠活动 - 介绍类型
export const SPECIAL_DESC_TYPE = ['图文介绍', '富文本'];

// 新手视频 - 状态 1-上架 3-下架
export const VIDEO_NOVICE_STATUS = [false, '上架中', false, '已下架'];

// 新手视频 - 区域类型
export const VIDEO_AREA_TYPE = { all: '全国', district: '单区域投放' };

// 新手视频 - 时间设置类型
export const VIDEO_TIME_TYPE = ['扣完为止', '固定时间'];

// 特惠商品 审核
export const SPECIAL_GOODS_CHECK_STATUS = {
  adminAudit: '待审核',
  merchantAudit: '待确认',
  adminConfirmed: '已审核',
  merchantConfirmed: '已确认',
};

// 操作类型 create-创建 update-修改 down-下架
export const ACTION_TYPE = {
  create: '创建审核',
  update: '修改审核',
  down: '下架审核',
};
// 周边特惠审核结果 审核状态0-待审核 1-已通过 2-已驳回 3-已关闭
export const GOODS_CHECK_RESSTATUS = [false, '已通过', '已驳回', '已关闭'];

// 审核结果
export const CHECK_STATUS = ['审核通过', '审核驳回', '商家已确认', '商家驳回'];

// 银行卡变更审核结果
export const BANK_CHECK_STATUS = ['审核驳回', '审核通过'];

// 供应商状态
export const SUPPLIER_STATUS = ['禁用', '启用'];

// 供应商账户状态 搜索用
export const SUPPLIER_ACCOUNT_STATUS = ['未激活', '已激活'];

// 供应商账户状态
export const SUPPLIER_ACCOUNT_STATUS_SHOW = ['未激活', '审核中', '激活失败', '已激活'];

// 供应商审核状态
export const SUPPLIER_AUTH_STATUS = ['审核拒绝', '审核通过'];

// 供应商类型
export const SUPPLIER_AUTH_TYPE = ['', '对公', '对私'];

// 标签类型
export const TAG_TYPE = {
  platform: '平台商品标签',
  show: '展示标签',
};

// 集合页配置集合页状态
export const PAGE_STATUS = ['进行中', '已结束'];

// 审核提交类型
export const SUBMIT_TYPE = {
  merchant: '商家',
  admin: '运营后台',
  sell: 'CRM',
  group: '集团',
  partner: '区县',
};

// 视频 审核类型
export const SUBMIT_TYPE_VIDEO = {
  merchant: '商家',
  admin: '运营后台',
  sell: 'CRM',
  group: '集团',
  partner: '区县',
  user: '哒人',
};

// serviceType specialGoods-特惠reduceCoupon-有价券 自定义分佣模板
export const SERVICE_TYPE = {
  specialGoods: '特惠商品 ',
  reduceCoupon: '优惠券',
  // rightGoods: '权益商品',
  // rightCoupon: '权益券',
  commerceGoods: '电商品',
};

// 模板类型 divisionTemplateType
export const DIVISION_TEMPLATE_TYPE = {
  difference: '按差价',
  manual: '手动分佣',
};

// 分佣模板创建人类别
export const TEMPLATE_CREATE_TYPE = {
  admin: '管理员',
  user: '用户',
  merchant: '商家',
  business: 'business',
  company: '省公司',
  partner: '区县代理',
  group: '集团',
  sell: 'CRM',
};

// 分佣配置
export const COMMISSION_TYPE = {
  specialGoods: {
    province: '省代分佣',
    city: '地级市分佣',
    district: '区县分佣',
    userParent: '用户家主分佣',
    merchantParent: '商家家主分佣',
    daren: '哒人分佣',
  },
  reduceCoupon: {
    province: '省代分佣',
    city: '地级市分佣',
    district: '区县分佣',
    userParent: '用户家主分佣',
    merchantParent: '商家家主分佣',
    daren: '哒人分佣',
  },
  commerceGoods: {
    province: '省代分佣',
    city: '地级市分佣',
    district: '区县分佣',
    userParent: '用户家主分佣',
    // merchantParent: '商家家主分佣',
    daren: '哒人分佣',
  },
};

// 活动模版类型
export const ACTIVE_TEMPLATE_TYPE = {
  active: '活动',
  rule: '规则',
  globalModal: '全局弹窗',
};

// 新闻分类
export const NEWS_TYPE = {
  newsReport: '新闻报道',
  companyActivities: '公司活动',
  daRenDynamic: '哒人动态',
  companyEvents: '公司大事件',
  productNews: '产品动态',
};

// 是否实习
export const DAREN_TEMP_FLAG = ['否', '是'];

// 集团管理 - 独立运营
export const BUS_OPERATION_FLAG = ['加盟', '直营'];

// 集团管理 -  独立结算
export const BUS_SETTLEMENT_FLAG = ['统一结算', '独立结算'];

// 集团管理 - 对公 对私
export const BUS_BANKACCOUNT_TYPE = [false, '对公(企业、组织机构)', '对私(个体工店铺)'];

//节日配置状态 状态 0-待上架 1-上架中 2-已下架
export const FESTIVAL_STATUS = ['待上架', '上架中', '已下架'];

// 卡豆红包类型
export const RED_ENVELOPES_TYPE = {
  message: '私信',
  normal: '普通',
  lucky: '拼手气',
};

// 社群红包类型
export const RED_ENVELOPES_TYPE_SHE = {
  normal: '普通',
  lucky: '拼手气',
};

export const RED_ENVELOP_STATUS = ['未领取', '已领取', '已退款'];

// 平台视频 - 状态 0-下架 1-上架 2-待上架
export const NEW_SHARE_STATUS = ['下架', '上架', '待上架'];

// 平台视频 - 归属人
export const NEW_SHARE_OWNER = { user: '哒人', merchant: '商家', group: '集团' };

// 平台视频 - 打赏状态 0-失效 1-生效 2-待生效
export const NEW_SHAREREWARD_STATUS = ['失效', '生效', '待生效'];

// 平台视频 - 时间设置类型
export const NEW_SHARETIME_TYPE = { permanent: '扣完为止', fixed: '固定时间' };

// 平台视频 - 投放类型
export const NEW_SHAREPUBLISHTIME_TYPE = { rightNow: '立即发布', fixed: '定时发布' };

// 商家视频 - 是否已打赏
export const NEW_SHARE_AWARD = { user: '哒人', merchant: '商家', group: '集团' };

// 视频审核店铺/视频类型
export const VIDEO_TYPE = {
  user: '哒人',
  merchant: '店铺',
  group: '集团',
};

// 视频审核类型
export const VIDEO_ACTION_TYPE = {
  create: '创建审核',
  update: '修改审核',
};

// 反馈问题类型 advice-功能反馈 problem-商家问题
export const FEEDBACK_TYPE = {
  advice: '功能反馈',
  problem: '商家问题',
};

// 视频广告 - 广告类型
export const VIDEO_ADVERT_TYPE = {
  merchant: '单店',
  group: '集团',
  brand: '品牌',
};

// 视频广告 - 状态 0-下架 1-发布中
export const VIDEO_ADVERT_STATUS = ['下架', '发布中'];

// 平台权益 - 商品售卖类型
export const PEQUITY_GOODSBUY_TYPE = ['免费', '卡豆+现金'];

// 平台权益 - 电商商品售卖类型
export const COMMERCE_GOODSBUY_TYPE = {
  self: '卡豆+现金',
  defaultMode: '现金',
  cashMode: '现金（不可使用卡豆）',
};

//评论状态
export const COMMENT_DELETFLAG = ['已删除', '正常'];

export const FOLLOW_TYPE = {
  consultation: '用户咨询',
  complaints: '用户投诉',
  activityVisit: '活动回访',
  normalVisit: '日常回访',
  other: '其他',
};

// 用户跟进类型
export const FOLLOW_MANNER = {
  weChat: '微信',
  mobile: '电话',
  applets: '小程序',
  public: '公众号',
  other: '其他',
};

//盲盒抽奖记录 - 签到游戏 - 发放状态
// export const GAME_SIGN_STATUS = ['未领取', '待发货', '已完成', '已过期', '未完善地址'];

//盲盒抽奖记录 - 免费领商品 - 发放状态
export const GAME_FREE_STATUS = ['未完善地址', '待发货', '已完成'];

//盲盒抽奖记录 - 签到游戏 - 奖品类型
export const GAME_SIGN_PACKAGE_TYPE = {
  bean: '卡豆',
  rightGood: '权益品',
};

// 盲盒商品类型枚举
export const BLINDBOX_PRIZE_TYPE = {
  bean: '卡豆',
  starBean: '星豆',
  growValue: '成长值',
  luckDrawChance: '抽奖次数（集碎片）',
  manure: '肥料',
  // rightGood: '权益产品',
  commerce: '电商商品',
  platformCoupon: '平台券',
  none: '谢谢惠顾',
};

//盲盒抽奖记录 - 抽奖状态
export const BOXLOTTERY_STATUS = ['未完善地址', '待发货', '已发货'];

// 盲盒抽奖记录 - 抽奖场次
export const BOXLOTTERY_TYPE = {
  bean: '卡豆',
  invitation: '邀请',
};

// 全局配置 - 逛逛页面配置
export const STROLLAROUND_TAB_TYPE = {
  iOS: 'iOS',
  android: 'Android',
  weChat: '小程序',
  mark: '哒小卡',
};

// 全局配置 - 首页tab配置
export const TAB_INDEX_TYPE = { iOS: 'iOS', android: 'Android', weChat: '小程序' };

// 全局配置 - 底部中心icon配置
export const BOTTOM_ICON_TYPE = { iOS: 'iOS', android: 'Android' };

// 全局配置 - 虚拟商品优惠比例配置
export const VIRTUAL_CONFIG_TYPE = {
  default: {
    default: '默认配置',
    phoneBill: '话费优惠',
    memberRecharge: '会员优惠',
    scanPay: '扫码付优惠',
    assembly: '组件优惠 ',
  },
  other: {
    phoneBill: '话费优惠',
    memberRecharge: '会员优惠',
    scanPay: '扫码付优惠',
    assembly: '组件优惠 ',
  },
};

// 全局配置 - 下单方式名称
export const VIRTUAL_ORDER_TYPE = {
  memberDefault: '会员默认',
  phoneDefault: '话费默认',
  scanDefault: '扫码默认',
  videoDefault: '视频默认',
  communityDefault: '团购默认 ',
  otherDefault: '其他场景默认',
  defaultIdentification: '全局默认',
};

//全局配置-节日配置-顶部动效图高度
export const VIRTUAL_TOP_HEIGHT = {
  400: '日常高度',
  // 500: '节日高度',
};

// 全局配置 - 首页tab配置 - 标签类型
export const TABINDEX_VIDEO_TYPE = {
  all: '通用',
  detail: '城市',
};

// 全局配置 - 风向标 - 标签类型
export const TABINDEX_VANE_TYPE = {
  all: '通用',
  city: '城市',
};

// 是否已打赏
export const BEANFLAG_TYPE = ['未打赏', '已打赏'];

//账户类型
export const ACCOUNT_TYPE = ['现金账户', '卡豆账户'];

//营销物料配置-跳转类型
export const MATERIAL_JUMP_TYPE = {
  main: '哒卡乐小程序',
  community: '哒小团小程序',
  mark: '哒小卡小程序',
};

// 平台券管理 - 券使用场景类型
export const PLATFORM_TICKET_SCENE = {
  goodsBuy: '商品券',
  // scan: '扫码',
  virtual: '虚拟品券',
  commerce: '电商品券',
  // community: '团购',
};

// 平台券管理 - 券类型
export const PLATFORM_TICKET_TYPE = {
  goodsBuy: {
    universal: '商品通用券',
    category: '行业商品券',
    merchant: '店铺商品券',
    goods: '指定商品券',
  },
  // scan: '扫码',
  virtual: {
    universal: '虚拟通用券',
    goods: '指定虚拟券',
  },
  commerce: {
    universal: '电商通用券',
    goods: '指定电商券',
  },
  // community: '团购',
};

// 平台券管理 - 使用时间
export const PLATFORM_USERTIME_TYPE = { fixed: '固定时间', gain: '领取后' };

// 平台券管理 - 适用人群
export const PLATFORM_COUPON_PEOPLE = { all: '全部', daren: '哒人' };

// 平台券管理 - 适用端口
export const PLATFORM_APPLY_PORT = { all: '全部', noAll: '部分平台' };

// 平台券管理 - 是否可膨胀
export const PLATFORM_INCREASE_RULE = ['不可膨胀', '可膨胀'];

// 券规则管理  端口类型
// 平台券管理 - 适用端口type
export const PLATFORM_APPLY_PORT_TYPE = {
  app: 'APP',
  weChat: '哒卡乐小程序',
  mark: '哒小卡小程序',
  communityWechat: '哒小团小程序',
};

// 券规则管理 - 父规则类型
export const CONPON_RULES_TYPE = {
  categoryRule: '行业',
  merchantRule: '店铺',
  goodsRule: '商品',
  tagRule: '标签',
  availableAreaRule: '可用区域',
  unavailableAreaRule: '不可用区域',
  userRule: '用户',
  userOsRule: '端口',
};

// 券规则管理 - 子规则类型
export const CONPON_RULES_SON_TYPE = {
  category: '行业',
  merchant: '店铺',
  group: '集团',
  specialGoods: '特惠商品',
  reduceCoupon: '有价券',
  commerceGoods: '电商品',
  phoneBill: '话费',
  member: '会员',
  platformGoodsTags: '平台商品标签',
  // merchantTags: '商家标签',
  merchantGoodsTags: '商家商品标签',
  availableArea: '可用区域',
  unavailableArea: '不可用区域',
  user: '用户',
  userOs: '端口',
};

// 券规则管理  店铺 类型
export const CONPON_RULES_BUSINESS_TYPE = { merchant: '单店', group: '集团' };

// 券规则管理  商品 类型
export const CONPON_RULES_GOODS_TYPE = {
  specialGoods: '特惠商品',
  reduceCoupon: '有价券',
  commerceGoods: '电商品',
  phoneBill: '话费充值',
  member: '会员充值',
};

// 券规则管理  用户类型  适用人群
export const CONPON_RULES_USER_TYPE = {
  daren: '仅限哒人',
};

// 礼包管理 - 卡券类型
export const SPREE_MANAGE_TYPE = {
  platformCoupon: '平台券',
  rightGoods: '权益商品',
  rightCoupon: '权益券',
};

// 哒小卡 - 点位管理 - 主体类型
export const MARK_CARD_MAIN_TYPE = {
  school: '学校',
  officeBuilding: '写字楼',
  factory: '工厂',
  enterprise: '企业',
  expressageState: '快递驿站',
  houseEstate: '小区',
  apartment: '公寓',
  merchant: '商户',
  market: '商场',
  other: '其他',
};

export const DAY_COUNT_NUM = {
  999: '不限',
  1: '每天限1次',
  2: '每天限2次',
};

// 哒小卡 - 点位管理 - 启用状态
export const MARK_CARD_OPEN_STATE = ['停用', '启用'];

// 哒小卡 - 点位管理 - 家主类型
export const MARK_CARD_PARENT_TYPE = {
  merchant: '店铺',
  user: '用户',
};

// 哒小卡 - 点位管理 - 特殊时间段类型
export const SPECIAL_TIME_TYPE = {
  all: '不限',
  fixedTime: '固定时间',
};

// 哒小卡 - 点位管理 - 其他奖品类型
export const OTHER_PRIZE_TYPE = {
  hittingRewardRightGoodsObject: '平台权益商品',
  hittingRewardOnlineGoodsObject: '电商品',
  hittingRewardActualGoodsObject: '自提商品',
};

// 全局配置 - 虚拟商品优惠比例配置 - 启用状态
export const VIR_OPEN_STATE = ['禁用', '启用', '已过期'];

// 全局配置 - 虚拟商品优惠比例配置 - 限优惠次数类型
export const VIR_OPEN_TYPE = ['不限', '每人限制'];

// 提现规则配置 - 代理商级别类型  AgencyTab
export const AGENCY_TYPE = {
  province: '省级代理',
  city: '市级代理',
  partner: '区县代理',
};

//点位审核状态 审核状态0-待审核 1-已审核 2-拒绝
export const VERIFY_STATUS_DOT = [false, '已通过', '已驳回'];

//点位审核类型 hittingType personal-个人 merchant-商家
export const HITTING_TYPE = {
  personal: '个人',
  merchant: '商家',
};

//用户数据统计 - 端口类型 - 数据枚举
export const USER_ANALYSIS_TYPE = {
  totalAppNum: 'APP',
  totalWeChatNum: '哒小乐',
  totalMarkNum: '哒小卡',
  totalCommunityNum: '哒小团',
};

//用户数据统计 - 支付人数类型
export const PAY_USER_TYPE = {
  totalFirstPayUserNum: '首次支付人数',
  totalPayUserNum: '总支付人数',
};

//用户数据统计 - 端口类型 - 入参筛选
export const USER_ANALYSIS_TYPES = [
  { label: 'APP', value: 'app' },
  { label: '哒小乐', value: 'weChat' },
  { label: '哒小卡', value: 'mark' },
  { label: '哒小团', value: 'communityWechat' },
];

//用户数据统计 - 渠道类型
export const CHANNEL_TYPE = {
  applicationMarket: '应用市场',
};

//视频数据统计 - 视频类型
export const VIDEO_DATA_TYPE = {
  totalPgcNum: 'PGC视频',
  totalUgcNum: 'UGC视频',
  totalPlatformNum: '广告视频',
  totalSdkNum: 'SDK视频',
};

//视频数据统计 - 视频数量 - PGC视频类型
export const PGC_VIDEO_TYPE = {
  lifeFunNum: '带货视频',
  pickUpNum: '探店视频',
};

//视频数据统计 - 视频数量 - UGC视频类型
export const UGC_VIDEO_TYPE = {
  foodNum: '美食',
  playNum: '潮玩',
  plotNum: '剧情',
};

//订单数据统计 - 商品类型 - 数据枚举
export const ORDER_GOODS_TYPE = {
  totalChannelData: '渠道商品',
  totalCommerceData: '电商商品',
  totalCommunityData: '团购商品',
  totalCouponData: '有价券',
  totalGiftData: '礼包订单',
  totalRightData: '权益品',
  totalScanData: '扫码支付',
  totalSpecialData: '特惠商品',
  totalVirtualData: '虚拟商品',
  totalWeeklyData: '周卡订单',
};

//订单数据统计 - 商品类型 - 入参筛选
export const ORDER_GOODS_TYPES = [
  { label: '扫码支付', value: 'scan' },
  { label: '特惠商品', value: 'special' },
  { label: '渠道商品', value: 'channel' },
  { label: '有价券', value: 'coupon' },
  { label: '权益品', value: 'right' },
  { label: '虚拟商品', value: 'virtual' },
  { label: '电商商品', value: 'commerce' },
  { label: '团购商品', value: 'community' },
  { label: '周卡订单', value: 'weekly' },
  { label: '礼包订单', value: 'gift' },
];

//订单数据统计 - 商品类型 - 入参筛选
export const AREA_ORDER_GOODS_TYPES = [
  { label: '扫码支付', value: 'scan' },
  { label: '特惠商品', value: 'special' },
  { label: '有价券', value: 'coupon' },
  { label: '权益品', value: 'right' },
];

//订单数据统计 - 支付金额分析 - 端口类型 - 对应
export const USER_ANALYSIS_CONTRAS = {
  app: 'APP',
  weChat: '小程序（含3个端口）',
  mark: '哒小卡',
  communityWechat: '哒小团',
};

//订单数据统计 - 商品类型 - 对应
export const ORDER_GOODS_CONTRAS = {
  scan: '扫码支付',
  topUp: '充值订单',
  specialGoods: '特惠商品',
  reduceCoupon: '有价券',
  communityGoods: '团购商品',
  virtualProduct: '虚拟商品',
  rightGoods: '权益商品',
  rightCoupon: '权益券',
  commerceGoods: '电商品',
  platformGift: '平台礼包',
  weeklyCard: '卡豆周卡',
  selfTour: '自我游',
  other: '其他',
};

//订单数据统计 - 商品订单类型
export const GOODS_ORDER_CONTRAS = {
  scan: '扫码支付',
  specialGoods: '特惠商品',
  commerceGoods: '电商品',
  reduceCoupon: '有价券',
  communityGoods: '团购商品',
  virtualProduct: '虚拟商品',
  right: '权益商品',
  platformGift: '平台礼包订单',
  weeklyCard: '卡豆周卡订单',
  channelGoods: '渠道商品',
};

//订单数据统计 - 地区占比 - 入参筛选
export const ORDER_AREA_TYPES = [
  { label: '扫码支付', value: 'scan' },
  { label: '特惠商品', value: 'specialGoods' },
];

//销售报表 - 订单类型
export const SELL_ORDER_TYPE = {
  scan: '扫码订单',
  // topUp: '充值订单',
  specialGoods: '特价商品订单',
  reduceCoupon: '有价券订单',
  communityGoods: '团购商品订单',
  virtualProduct: '虚拟商品订单',
  rightGoods: '权益商品订单',
  // rightCoupon: '权益券订单',
  commerceGoods: '电商商品订单',
  platformGift: '平台礼包订单',
  weeklyCard: '卡豆周卡订单',
  channelGoods: '渠道商品',
};

// 提现明细  - 店铺  - 类型
export const WITHDRAW_BUSINESS_TYPE = { merchant: '单店', group: '集团', subMerchant: '子门店' };
//开团列表

export const OPEN_GROUP_STATUS = ['拼团中', '拼团成功', '拼团失败'];

export const REWARD_TYPE = {
  winGoods: '拼中商品',
  winRed: '拼中红包',
};

export const GROUP_RULE = {
  3: '3人团',
  6: '6人团',
  10: '10人团',
};
export const GROUP_RULE_WIN = {
  3: '1',
  6: '2',
  10: '3',
};

// 电商品 - 商品状态
export const ELECTRICGOODS_STATUS = ['已下架', '上架中'];

// 电商品 - 售卖类型
export const ELECTRICGOODS_SELL_STATUS = {
  single: '零售',
  batch: '批采',
};

// 电商品 - 库存单位
export const ELECTRICGOODS_SKU = {
  件: '件',
  只: '只',
  瓶: '瓶',
  袋: '袋',
  包: '包',
  箱: '箱',
  盒: '盒',
  条: '条',
  听: '听',
  杯: '杯',
  提: '提',
  捆: '捆',
  码: '码',
  把: '把',
  本: '本',
  台: '台',
  块: '块',
  对: '对',
  套: '套',
  双: '双',
  克: '克',
  钱: '钱',
  两: '两',
  斤: '斤',
  公斤: '公斤',
  吨: '吨',
  千克: '千克',
};

// 电商品 - 售卖价格类型
export const ELECTRICGOODS_SELL_PRICE_TYPE = {
  defaultMode: '现金（可用卡豆抵扣）',
  cashMode: '现金（不可用卡豆抵扣）',
  self: '卡豆+现金',
  free: '免费',
};

// 电商品 - 前端展示类型(不免费)
export const FRONT_SHOW_TYPE = {
  manualOrList: '手动/列表展示',
  manual: '仅手动展示',
  notDisplay: '不展示',
};

// 电商品 - 前端展示类型(免费)
export const FRONT_SHOW_TYPE_FREE = {
  manual: '仅手动展示',
  notDisplay: '不展示',
};

// 电商品 - 运费类型
export const FREIGHT_TYPE = {
  free: '免邮',
  manual: '全国统一价',
};

// 电商品 - 结算人类型
export const SETTLE_TYPE = {
  // settle: '供应商',
  pingtai: '平台',
};
//行业管理 - 前台类目
export const TRADESET_SELECT = {
  behind: '按后台类目',
  h5: 'H5地址',
};

export const ASTRICT_BUY = {
  unlimited: '不限',
  personLimit: '每人限制',
  // dayLimit: '每天限制',
  // weekLimit: '每周限制',
  // monthLimit: '每月限制',
};
