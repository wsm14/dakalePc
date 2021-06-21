// 导出表头
export default [
  {
    title: '订单号',
    dataIndex: 'orderSn',
  },
  {
    title: '手机号',
    dataIndex: 'userMobile',
  },
  {
    title: '店铺名称',
    dataIndex: 'merchantName',
  },
  {
    title: '用户支付',
    dataIndex: 'payFee',
    render: (val, record) => `${val}（含${record.beanFee ? record.beanFee : 0}卡豆）`,
  },
  {
    title: '店铺实收',
    dataIndex: 'actualCashFee',
    render: (val, record) => `${val}（含${record.actualBeanFee ? record.actualBeanFee : 0}卡豆）`,
  },
  {
    title: '优惠券',
    dataIndex: 'reduceFee',
    render: (val) => (val ? `${val}元抵扣券（-￥${val || 0}）` : '--'),
  },
  {
    title: '支付时间',
    dataIndex: 'createTime',
  },

  {
    title: '下单渠道',
    dataIndex: 'orderSource',
  },
  {
    title: '区域',
    dataIndex: 'merchantProvince',
    render: (val, row) => `${row.merchantProvince}-${row.merchantCity}-${row.merchantDistrict}`,
  },
];
