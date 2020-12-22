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

// 权限按钮映射 和 HandleSetTable 对应
export const ROLE_BUTTON_TYPE = {
  info: '详情',
  set: '设置',
  eye: '查看',
  edit: '编辑',
  del: '删除',
  check: '审核',
  send: '发布',
  up: '上架',
  down: '下架',
  save: '新增',
  replay: '回复',
  status: '状态',
  recommendStatus: '推荐状态',
  bussinessStatus: '营业状态',
  relieve: '解约',
  income: '收益数据',
  withdraw: '提现数据',
  handle: '处理',
  checkDetail: '审核记录',
  setMreCord: '设置商家验证码',
  exportList: '导出列表',
  qrCode: '获取二维码',
  activate: '账户激活',
  handleDeatil: '操作记录',
  stockSet: '库存设置',
  targetSet: '任务设置',
  rightsSet: '权益设置',
  topic: '话题设置',
  saveClassify: '添加内容子类',
  savePClassify: '添加内容分类',
  reportCenter: '举报中心',
  noticeAdd: '公告新增',
  noticeEdit: '公告修改',
  noticeDel: '公告删除',
  noticeSend: '公告发送',
  couponAdd: '优惠券新增',
  destoryDetail: '核销明细',
  orderDetail: '订单明细',
  couponDetail: '优惠券详情',
  shareImg: '分享图片',
  shareText: '分享文案',
  markImg: '打卡图片',
  markText: '打卡文案',
  shareImgAdd: '新增分享图片',
  shareImgEdit: '修改分享图片',
  markTextAdd: '新增分享文案',
  shareTextEdit: '修改分享文案',
  markImgEdit: '修改打卡图片',
  markTextEdit: '修改打卡文案',
  tradeSet: '行业设置',
  searchSet: '热门搜索配置',
  peasDetail: '卡豆明细',
  rechargeDetail: '充值记录',
  user: '用户',
  userAdd: '新增用户',
  userStatus: '用户状态',
  userEdit: '用户编辑',
  role: '角色',
  roleStatus: '角色状态',
  roleEdit: '角色权限设置',
  section: '部门',
  baseTrade: '基础设施',
  tradeAdd: '新增类目',
  tradeSecondAdd: '添加子类目',
};

// 数据权限选项
export const WORKER_ROLEDATA_TYPE = [
  { value: 1, name: '本人' },
  { value: 25, name: '本部门（不含下级部门）' },
  { value: 50, name: '本部门及以下级部门 ' },
  { value: 100, name: '全部' },
];

// 加盟申请状态
export const FRANCHISE_APP_STATUS = ['未处理', '已处理'];

// 提现状态
export const WITHDRAW_STATUS = [false, false, '处理中', '成功', '失败'];

// 反馈状态
export const FEEDBACK_STATUS = [false, '处理中', '已解答'];

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

// 分享类型
export const SHARE_TYPE = [
  { value: 'video', name: '视频' },
  { value: 'image', name: '图文' },
];

// 分享状态 0-待审核；1-审核通过 2-审核拒绝 3-下架 4-删除 5-分享完成
export const SHARE_STATUS = [false, '已上架', false, '下架', '删除', '分享完成'];

// 种草状态 0-待审核；1-审核通过 2-审核拒绝 3-下架 4-删除 5-分享完成
export const RECOMMEND_STATUS = [false, '审核通过', false, '下架', '删除', '分享完成'];

// 商品状态
export const GOODS_TYPE = ['下架', '上架', '预售', '未发布'];

// 订单类型
export const ORDERS_TYPE = [
  { name: '哒人带货', value: 'kolGoods' },
  { name: '周边特惠', value: 'specialGoods' },
];

// 订单支付类型
export const PAY_TYPE = { beanPay: '卡豆支付', wechat: '微信支付', alipay: '支付宝支付' };

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

// 员工在职状态
export const WORKER_JOB_TYPE = ['离职', '在职'];

export const WORKER_BANK_STATUS = [
  {
    label: '0',
    value: '未激活',
  },
  {
    label: '1',
    value: '审核中',
  },
  {
    label: '2',
    value: '激活失败',
  },
  {
    label: '3',
    value: '激活成功',
  },
];

// Banner展示状态
export const BANNER_SHOW_STATUS = ['待展示', '展示中', '已下架'];

// Banner类型
export const BANNER_TYPE = [
  { value: 'main', name: '首页' },
  { value: 'merchant', name: '到店打卡' },
  { value: 'person', name: '个人' },
  { value: 'merchantMain', name: '商家主页' },
  { value: 'mainSpecial', name: '周边特惠首页' },
  { value: 'surroundingSpecial', name: '周边特惠列表' },
];
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

// 周边特惠 - 上架状态
export const SPECIAL_STATUS = ['已下架', '活动中', '即将开始'];

// 周边特惠 - 推荐状态
export const SPECIAL_RECOMMEND_STATUS = ['否', '是'];

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

export const filterList = (str) => {
  if (!str) {
    return [];
  } else {
    return str.split(',');
  }
};
