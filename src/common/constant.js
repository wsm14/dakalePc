/**
 * 统一参数配置
 */

import moment from 'moment';

// 登录权限key
export const AUTH_SECRET_KEY = '733828mtizndu2cshfp1468889281801r9uv0aaji10';

// 高德地图key
export const AMAP_KEY = 'b71a4ssaasdasdsssacb0b1b7';

// 加盟申请状态
export const FRANCHISE_APP_STATUS = ['未处理', '已处理'];

// 提现状态
export const WITHDRAW_STATUS = [false, false, '处理中', '成功', '失败'];

// 反馈状态
export const FEEDBACK_STATUS = [false, '处理中', '已解答'];

// 加盟申请状态
export const CITY_PARTNER_STATUS = ['正常', '冻结', '解约'];

// 用户状态
export const ACCOUNT_STATUS = ['禁用', '启用'];

// 菜单状态
export const MENU_STATUS = ['禁用', '启用'];

// 实名状态
export const REAL_NAME_STATUS = ['未实名', '认证中', '已经实名', '审核拒绝'];

// 商铺状态
export const BUSINESS_STATUS = ['暂停营业', '营业'];

// '待审核', '审核中', '审核驳回', '审核通过'
export const BUSINESS_STATUS_AUDIT = [false, '审核中', '审核驳回', '审核通过'];

// 挑战赛状态
export const MATCH_STATUS = ['已取消', '等待揭晓', '已结束'];

// 用户挑战赛状态
export const MATCH_USER_STATUS = ['已取消', '已报名', '已完成', '已领奖'];

// 活动状态
export const ACTIVITY_STATUS = ['待开始', '进行中', '已下架'];

// 卡券状态
export const ACTIVE_COUPON_STATUS = ['未使用', '已过期', '已核销'];

// 卡豆乐园 公告状态
export const MARKET_NOTICE_STATUS = ['待发布', '已发布'];

// Banner状态
export const BANNER_STATUS = ['下架', '上架'];

// Banner类型
export const BANNER_TYPE = [
  { value: 'main', name: '首页' },
  { value: 'merchant', name: '到店打卡' },
  { value: 'person', name: '个人' },
  { value: 'near', name: '周边' },
];

// Banner跳转类型
export const BANNER_JUMP_TYPE = [
  { value: '无', name: '无' },
  { value: 'H5', name: 'H5' },
  { value: '内部', name: '内部' },
];

// Banner类型
export const CHECKIN_TYPE = [
  { value: 'health', name: '健康打卡' },
  { value: 'habit', name: '习惯打卡' },
];

// 用户类型
export const MASTER_TYPE = [
  { value: 'user', name: '用户' },
  { value: 'merchant', name: '商家' },
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
