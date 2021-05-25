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

// 订单支付类型
export const PAY_TYPE = {
  beanPay: '卡豆支付',
  wechat: '微信支付',
  alipay: '支付宝支付',
  wx_lite: '微信小程序',
};

// 导出excel枚举
export const EXPORT_TYPE = {
  darenList: '哒人列表',
  userRegistration: '用户注册明细',
  merchantMark: '到店打卡明细',
  momentCollarBean: '视频领豆明细',
};

// 加盟申请状态
export const FRANCHISE_APP_STATUS = ['未处理', '已处理'];

// 提现状态
export const WITHDRAW_STATUS = [false, '发起提现', '处理中', '成功', '失败'];

// 反馈状态
export const FEEDBACK_STATUS = [false, '处理中', '已解答'];

// 用户状态
export const ACCOUNT_STATUS = ['禁用', '启用'];

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

// 活动状态
export const ACTIVITY_STATUS = ['待开始', '进行中', '已下架'];

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
export const BANNER_SHOW_STATUS = ['待展示', '展示中', '已下架'];

// 广告管理 - 投放区域类型
export const BANNER_AREA_TYPE = { all: '全平台', detail: '省市区' };

// 广告管理 - 可见范围
export const BANNER_LOOK_AREA = {
  'user,kol': '全部',
  kol: '仅哒人可见',
  user: '仅用户可见',
};

// 周边特惠 - 上架状态 0-已下架 1-活动中 2-即将开始 3-审核中 4-未通过
export const SPECIAL_STATUS = ['已下架', '活动中', '即将开始', '审核中', '未通过'];

// 店铺标签状态
export const MRE_TAG_STATUS = ['停用', '启用'];

// FAQ猜你想问
export const FAQ_LIKE_STATUS = ['未设置', '已设置'];

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
];

// 订单关闭状态
export const ORDER_CLOSE_TYPE = {
  unpaidExpiredCancel: '待付款超时自动关闭',
  unpaidManualCancel: '订单已取消',
  expiredRefund: '订单已过期，订单自动过期', //过期退款
  manualRefund: '已退款成功，申请退款成功', // 手动退款
};

// 退款订单状态
export const REFUND_ORDERS_STATUS = [false, false, '订单关闭', '交易完成', false, false, '退款中'];

// 哒人带货 订单状态
export const EXPRET_DISTRIBUTION_STATUS = ['待分佣', '已分佣', false, false, '已退款'];

// 哒人带货 订单对应状态
export const EXPRET_DISTRIBUTION_PAY_STATUS = ['付款', '核销', false, false, '退款'];

// 用户来源
export const USER_SOURCE = { weChat: '小程序', app: 'APP' };

// 合作意向类型
export const FRANCHISE_COOPERATION_TYPE = { company: '省公司', partner: '区县代理' };

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
export const MSG_PSUH_OBJECT = { all: '全部用户' };

// 消息推送 - 跳转类型
export const MSG_PSUH_URL = { h5: 'H5', native: '原生' };

// 补贴管理 补贴类型
export const SUBSIDY_TYPE = {
  platform: '营销卡豆',
  directCharge: '平台直充',
  // recycleDirectCharge: '平台直充回收',
  // recyclePlatform: '营销卡豆回收',
  platformSubsidy: '新手任务补贴',
};

// 补贴管理 补贴卡豆类型
export const SUBSIDY_BEAN_TYPE = { out: '补贴', in: '回收' };

// 补贴管理 任务列表 补贴角色
export const SUBSIDY_TASK_ROLE = { merchant: '店铺' };

// 补贴管理 行为管理 补贴角色
export const SUBSIDY_ACTION_ROLE = { user: '用户', merchant: '店铺' };

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
  kolGoods: '哒人带货',
  specialGoods: '周边特惠',
  reduceCoupon: '抵扣券订单',
  marketCoupon: '兑换券订单',
};

// 平台收益订单类型
export const PLATFORM_INCOME_ORDERS_TYPE = {
  scan: '扫码订单',
  writeOff: '核销订单',
};

// 账户激活状态
export const WORKER_BANK_STATUS = ['未激活', '审核中', '激活失败', '激活成功'];

// 开屏广告端口
export const OPEN_ADVERT_PORT = { user: '用户端', merchant: '商家端' };

// Banner端口
export const BANNER_PORT_TYPE = { user: '用户端', merchant: '商家端', weChat: '微信小程序' };

// Banner类型
export const BANNER_PORT_LINK = {
  user: {
    person: '个人',
    hotWeal: '爆品福利',
    wanderAroundMainBanner: '逛逛主Banner',
    wanderAroundCapsule: '逛逛胶囊位',
    wanderAroundGoodMerchant: '逛逛周边好店',
  },
  weChat: {
    person: '个人',
    hotWeal: '爆品福利',
    wanderAroundMainBanner: '逛逛主Banner',
    wanderAroundCapsule: '逛逛胶囊位',
    wanderAroundGoodMerchant: '逛逛周边好店',
  },
  merchant: {
    merchantMain: '商家工作台',
  },
  // mainSpecial: '周边特惠首页',
  // surroundingSpecial: '周边特惠列表',
};

// Banner跳转类型
export const BANNER_JUMP_TYPE = { 无: '无', H5: 'H5', inside: '原生页面' };

// 用户类型
export const MASTER_TYPE = { user: '用户', merchant: '店铺' };

// 商品类型
export const GOODS_CLASS_TYPE = { single: '单品', package: '套餐' };

// 风向标跳转类型
export const VANE_URL_TYPE = { url: '跳转至URL', scenes: '按场景显示' };

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
export const SHARE_AGE_TYPE = { '1-100': '不限', age: '选择年龄段(可多选)' };

// 分享设置 - 时间设置类型
export const SHARE_TIME_TYPE = ['扣完为止', '固定时间'];

// 优惠券管理 - 优惠券状态
export const COUPON_STATUS = [false, '上架中', '已下架'];

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

// 优惠券管理 - 优惠券类型
export const COUPON_ACTIVE_TYPE = { fixed: '固定时间', infinite: '长期' };

// 收入/支出
export const ADD_AND_MINUS = { add: '收入', minus: '支出' };

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
  hotRecommend: '限时推荐',
  todayRecommend: '爆品推荐',
  hotTop: '限时置顶',
  todayTop: '爆品置顶',
  thisPeriod: '本期必抢',
  nextPeriod: '下期预告',
  novice: '新手视频',
  cancel: '取消推荐',
};

// 特惠活动 - 热销推荐列表枚举
export const SPECIAL_RECOMMEND_LISTTYPE = {
  hot: '限时',
  today: '爆品',
  thisPeriod: '本期必抢',
  nextPeriod: '下期预告',
  novice: '新手视频',
};

// 视频广告 - 是否删除
export const SPECIAL_RECOMMEND_DELSTATUS = ['已删除', '未删除'];

// 视频广告 - 新手视频状态 1-上架 3-下架
export const VIDEO_NOVICE_STATUS = [false, '上架中', false, '已下架'];

// 视频广告 - 区域类型
export const VIDEO_AREA_TYPE = { all: '全国', district: '单区域投放' };

// 视频广告 - 时间设置类型
export const VIDEO_TIME_TYPE = ['扣完为止', '固定时间'];
