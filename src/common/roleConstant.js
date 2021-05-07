// 权限按钮映射 和 HandleSetTable 对应
export const ROLE_BUTTON_TYPE = {
  adRoot: '广告配置',
  action: '使用规则',
  activate: '账户激活',
  actionDel: '删除行为',
  actionEdit: '修改行为',
  actionSave: '新增使用规则',

  baseTrade: '基础设施',
  bussinessStatus: '营业状态',

  copy: '复制',
  check: '审核',
  couponAdd: '优惠券新增',
  checkDetail: '审核记录',
  couponDetail: '优惠券详情',

  del: '删除',
  down: '下架',
  diary: '日志',
  direct: '平台直充',
  directDel: '删除平台直充',
  directEnd: '结束平台直充',
  directInfo: '平台直充任务详情',
  directSave: '新增平台直充',
  directDetail: '平台直充补贴详情',
  destoryDetail: '核销明细',

  eye: '查看',
  end: '结束',
  edit: '编辑',
  exportList: '导出',

  handle: '处理',
  handleDeatil: '操作记录',

  info: '详情',
  income: '收益明细',
  isWechat: '小程序展示控制',

  jobClass: '职位类别',

  mreOs: '商家端',
  markImg: '打卡图片',
  markText: '打卡文案',
  markTextAdd: '新增分享文案',
  markImgEdit: '修改打卡图片',
  markTextEdit: '修改打卡文案',

  noticeAdd: '公告新增',
  noticeEdit: '公告修改',
  noticeDel: '公告删除',
  noticeSend: '公告发送',

  orderDetail: '订单明细',

  push: '推送',
  placement: '置顶',
  peasDetail: '卡豆明细',

  qrCode: '获取二维码',

  role: '角色',
  revoke: '撤销',
  replay: '回复',
  relieve: '解约',
  roleAdd: '角色添加',
  roleEdit: '角色权限设置',
  rightsSet: '权益设置',
  roleStatus: '角色状态',
  reportCenter: '举报中心',
  recommendList: '推荐列表',
  rechargeDetail: '充值记录',
  recommendStatus: '推荐状态',

  set: '设置',
  save: '新增',
  send: '发布',
  sort: '排序',
  status: '状态',
  section: '部门',
  setLike: '设置猜你想问',
  sortFAQ: '分类管理',
  shareImg: '分享图片',
  stockSet: '库存设置',
  shareText: '分享文案',
  sharePush: '发布分享',
  searchSet: '热门搜索配置',
  statistics: '统计',
  signDetail: '打卡明细',
  setMreCord: '设置商家验证码',
  shareImgAdd: '新增分享图片',
  shareImgEdit: '修改分享图片',
  saveClassify: '添加内容子类',
  savePClassify: '添加内容分类',
  shareTextEdit: '修改分享文案',

  task: '营销卡豆充值',
  topic: '创作设置',
  taskDel: '删除营销卡豆充值',
  taskEnd: '结束营销卡豆充值',
  tradeAdd: '新增类目',
  taskSave: '新增营销卡豆充值',
  taskInfo: '营销卡豆充值任务详情',
  targetSet: '营销卡豆充值设置',
  taskDetail: '营销卡豆充值补贴详情',
  tradeSecondAdd: '添加子类目',

  up: '上架',
  user: '用户',
  userOs: '用户端',
  userAdd: '新增用户',
  userEdit: '用户编辑',
  userStatus: '用户状态',

  withdraw: '提现记录',

  republish: '重新发布',
};

// 数据权限选项
export const WORKER_ROLEDATA_TYPE = [
  { value: 1, name: '本人' },
  { value: 25, name: '本部门（不含下级部门）' },
  { value: 50, name: '本部门及以下级部门 ' },
  { value: 100, name: '全部' },
];
