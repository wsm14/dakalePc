/**
 * 统一参数配置
 */

import moment from 'moment';

// 登录权限key
export const AUTH_SECRET_KEY = '733828mtizndu2cshfp1468889281801r9uv0aaji10';

// 高德地图map key
export const AMAP_KEY = 'b71a4bfb0ccc175459fdadf06cb0b1b7';

// 高德地图js key
export const AMAP_JS_KEY = 'ebb2511fda31f6cbf5c5c9a5d7e84e39';

// 反馈身份
export const FEEDBACK_USER_TYPE = {
  user: '用户',
  merchant: '商家',
  company: '省公司',
  patner: '区县',
};

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

// 加盟申请状态
export const FRANCHISE_APP_STATUS = ['未处理', '已处理'];

// 提现状态
export const WITHDRAW_STATUS = [false, false, '处理中', '成功', '失败'];

// 反馈状态
export const FEEDBACK_STATUS = [false, '处理中', '已解答'];

// 用户状态
export const ACCOUNT_STATUS = ['禁用', '启用'];

// 实名状态
export const REAL_NAME_STATUS = ['未实名', '认证中', '已经实名', '审核拒绝'];

// 商户 营业状态
export const BUSINESS_DO_STATUS = ['暂停营业', '营业'];

// 商户 账户状态(银行卡绑定状态)
export const BUSINESS_ACCOUNT_STATUS = [false, false, '未激活', '已激活'];

// 商户 账户激活状态
export const MRE_ACCOUNT_STATUS = ['未绑定', '审核中', '绑定失败', '绑定成功'];

// 商户 绑定激活查询排序
export const MRE_SORT_STATUS = ['提交审核时间倒序', '按审核时间倒序', '按绑卡时间倒序'];

// 商户 店铺状态
export const BUSINESS_STATUS = ['禁用', '启用'];

// 商户 审核状态 '待审核', '审核中', '审核驳回', '审核通过'
export const BUSINESS_STATUS_AUDIT = ['待审核', '审核中', '审核驳回', '审核通过'];

// 商户 审核记录状态 '审核通过', '审核驳回'
export const BUSINESS_DETAIL_AUDIT = ['审核通过', '审核驳回'];

// 商户 注册列表 状态
export const BUSINESS_REGISTER_STATUS = ['已注册', '已入驻', '未激活', '已激活'];

// 挑战赛状态
export const MATCH_STATUS = ['已取消', '等待揭晓', '已结束'];

// 用户挑战赛状态
export const MATCH_USER_STATUS = ['已取消', '已报名', '已完成', '已领奖'];

// 哒人状态
export const EXPERT_USER_STATUS = ['永久封停', '正常', '封停1天', '封停1周', '封停1月'];

// 活动状态
export const ACTIVITY_STATUS = ['待开始', '进行中', '已下架'];

// 提现状态
export const COLLECT_STATUS = [false, '发起提现', '处理中', '成功', '失败'];

// 卡券状态
export const ACTIVE_COUPON_STATUS = ['未使用', '已过期', '已核销'];

// 卡豆乐园 公告状态
export const MARKET_NOTICE_STATUS = ['待发布', '已发布'];

// 新闻动态状态
export const NEWS_STATUS = ['下架', '上架'];

// 分享状态 0-待审核；1-审核通过 2-审核拒绝 3-下架 4-删除 5-分享完成
export const SHARE_STATUS = [false, '已上架', false, '下架', '删除', '分享完成'];

// 种草状态 0-待审核；1-审核通过 2-审核拒绝 3-下架 4-删除 5-分享完成
export const RECOMMEND_STATUS = [false, '审核通过', false, '下架', '删除', '分享完成'];

// 商品状态 0-已下架 1-上架中 2-预售 3-未发布
export const GOODS_TYPE = ['已下架', '上架中', false, '未发布'];

// 商户确认状态
export const MRE_SURE_TYPE = ['已驳回', '确认中', '已确认'];

// 员工在职状态
export const WORKER_JOB_TYPE = ['离职', '在职'];

// Banner展示状态
export const BANNER_SHOW_STATUS = ['待展示', '展示中', '已下架'];

// 周边特惠 - 上架状态
export const SPECIAL_STATUS = ['已下架', '活动中', '即将开始'];

// 周边特惠 - 推荐状态
export const SPECIAL_RECOMMEND_STATUS = ['否', '是'];

// 商户标签状态
export const MRE_TAG_STATUS = ['停用', '启用'];

// 省代/区县公司状态
export const COMPANY_PROV_STATUS = ['正常', '冻结', '解约'];

// 订单状态
export const ORDERS_STATUS = [
  '待支付',
  '已支付',
  '订单关闭',
  '交易完成',
  '已确认',
  '预支付',
  '退款中',
];

// 退款订单状态
export const REFUND_ORDERS_STATUS = [
  false,
  false,
  '订单关闭',
  '交易完成',
  '已确认',
  false,
  '退款中',
];

// 合作意向类型
export const FRANCHISE_COOPERATION_TYPE = { company: '省公司', partner: '区县代理' };

// 分享类型
export const SHARE_TYPE = [
  { value: 'video', name: '视频' },
  { value: 'image', name: '图文' },
];

// 订单类型
export const ORDERS_TYPE = [
  { name: '哒人带货', value: 'kolGoods' },
  { name: '周边特惠', value: 'specialGoods' },
];

// 账户激活状态
export const WORKER_BANK_STATUS = [
  { label: '0', value: '未激活' },
  { label: '1', value: '审核中' },
  { label: '2', value: '激活失败' },
  { label: '3', value: '激活成功' },
];

// Banner类型
export const BANNER_TYPE = [
  { value: 'main', name: '首页' },
  { value: 'merchant', name: '到店打卡' },
  { value: 'person', name: '个人' },
  { value: 'merchantMain', name: '商家主页' },
  { value: 'mainSpecial', name: '周边特惠首页' },
  { value: 'surroundingSpecial', name: '周边特惠列表' },
];

// 用户性别
export const SEX_TYPE = [
  { value: 'M', name: '男' },
  { value: 'F', name: '女' },
];

// Banner跳转类型
export const BANNER_JUMP_TYPE = [
  { value: '无', name: '无' },
  { value: 'H5', name: 'H5' },
  { value: '内部', name: '内部' },
];

// 用户类型
export const MASTER_TYPE = [
  { value: 'user', name: '用户' },
  { value: 'merchant', name: '商户' },
];

// 默认起始结束时间
const now = new Date();
export const INIT_END_TIME = moment(now, 'YYYY-MM-DD');

now.setDate(now.getDate() - 7); // 默认最近1周的数据

export const INIT_START_TIME = moment(now, 'YYYY-MM-DD');

// 计算时间差
export const TIME_DIFF_HOURS = (start, end) => {
  return moment(end).diff(moment(start), 'hours');
};

// 时间格式化YYYY-MM-DD
export const TIME_YMD = (time) => {
  return moment(time).format('YYYY-MM-DD');
};

// 时间格式化YYYY-MM-DD hh:mm
export const TIME_YMDHM = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm');
};

// 时间格式化YYYY-MM-DD hh:mm:ss
export const TIME_YMDHMS = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
};

// 时间格式化YYYY-MM-DD hh:mm:ss
export const TIME_YMDHM0 = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:00');
};

// 时间格式化YYYY-MM-DD hh:mm:ss
export const TIME_YMDHMS_S = (time) => {
  return moment(time).format('YYYY-MM-DD 00:00:00');
};

export const TIME_YMDHMSE_E = (time) => {
  return moment(time).format('YYYY-MM-DD 23:59:59');
};

// 获取时间戳
export const TIME_UNIX = (time) => {
  return moment(time).format('x');
};

// 获取时间戳_ 00000
export const TIME_UNIX_S = (time) => {
  return moment(moment(time).format('YYYY-MM-DD 00:00:00')).format('x');
};

// 获取时间戳_ 23:59:59
export const TIME_UNIX_E = (time) => {
  return moment(moment(time).format('YYYY-MM-DD 23:59:59')).format('x');
};

// 获取七天前时间戳_ 00:00:00
export const TIME_UNIX_7E = () => {
  return moment(moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00')).format('x');
};
