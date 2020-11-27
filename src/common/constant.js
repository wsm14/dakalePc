/**
 * 统一参数配置
 */

import moment from 'moment';

// 登录权限key
export const AUTH_SECRET_KEY = '733828mtizndu2cshfp1468889281801r9uv0aaji10';

// 高德地图key
export const AMAP_KEY = 'b71a4bfb0ccc175459fdadf06cb0b1b7';

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

// 商户 店铺状态
export const BUSINESS_STATUS = ['禁用', '启用'];

// 商户 审核状态 '待审核', '审核中', '审核驳回', '审核通过'
export const BUSINESS_STATUS_AUDIT = ['', '审核中', '审核驳回', ''];

// 挑战赛状态
export const MATCH_STATUS = ['已取消', '等待揭晓', '已结束'];

// 用户挑战赛状态
export const MATCH_USER_STATUS = ['已取消', '已报名', '已完成', '已领奖'];

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

// 员工在职状态
export const WORKER_JOB_TYPE = ['离职', '在职'];

// 员工在职状态
export const WORKER_BANK_TYPE = [{
  label:'0',
  value:'未绑定'
},{
  label:'1',
  value:'审核中'
},{
  label:'2',
  value:'绑定失败'
},{
  label:'3',
  value:'绑定成功'
}]
export const WORKER_ROLEDATA_TYPE = [
  { value: 1, name: '本人' },
  { value: 25, name: '本部门（不含下级部门）' },
  { value: 50, name: '本部门及以下级部门 ' },
  { value: 100, name: '全部' },
];

// Banner展示状态
export const BANNER_SHOW_STATUS = ['待展示', '展示中', '已下架'];

// Banner类型
export const BANNER_TYPE = [
  { value: 'main', name: '首页' },
  { value: 'merchant', name: '到店打卡' },
  { value: 'person', name: '个人' },
  { value: 'near', name: '周边' },
  { value: 'merchantMain', name: '商家主页' },
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
