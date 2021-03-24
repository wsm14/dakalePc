// 权限按钮映射 和 HandleSetTable 对应
export const ROLE_BUTTON_TYPE = {
  info: '详情',
  save: '新增',
  eye: '查看',
  edit: '编辑',
  del: '删除',
  check: '审核',
  send: '发布',
  up: '上架',
  down: '下架',
  status: '状态',
  exportList: '导出',
  set: '设置',
  copy: '复制',
  push: '推送',
  revoke: '撤销',
  replay: '回复',
  handle: '处理',
  relieve: '解约',
  end: '结束',
  sort: '排序',
  adRoot: '广告配置',
  userOs: '用户端',
  mreOs: '商家端',
  jobClass: '职位类别',
  recommendStatus: '推荐状态',
  bussinessStatus: '营业状态',
  sharePush: '发布分享',
  signDetail: '打卡明细',
  income: '收益明细',
  withdraw: '提现记录',
  checkDetail: '审核记录',
  setMreCord: '设置商家验证码',
  qrCode: '获取二维码',
  activate: '账户激活',
  handleDeatil: '操作记录',
  stockSet: '库存设置',
  targetSet: '任务设置',
  rightsSet: '权益设置',
  topic: '创作设置',
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
  roleAdd: '角色添加',
  roleStatus: '角色状态',
  roleEdit: '角色权限设置',
  section: '部门',
  baseTrade: '基础设施',
  tradeAdd: '新增类目',
  tradeSecondAdd: '添加子类目',
  sortFAQ: '分类管理',
  setLike: '设置猜你想问',
  task: '任务列表',
  taskInfo: '任务详情',
  taskSave: '新增任务',
  taskDel: '删除任务',
  taskEnd: '结束任务',
  action: '行为管理',
  actionSave: '新增行为',
  actionDel: '删除行为',
  actionEdit: '修改行为',
};

// 数据权限选项
export const WORKER_ROLEDATA_TYPE = [
  { value: 1, name: '本人' },
  { value: 25, name: '本部门（不含下级部门）' },
  { value: 50, name: '本部门及以下级部门 ' },
  { value: 100, name: '全部' },
];
