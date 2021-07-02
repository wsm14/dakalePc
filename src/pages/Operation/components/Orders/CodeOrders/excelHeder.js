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
    title: '用户实付（卡豆+现金）',
    dataIndex: 'payFee',
    render: (val, record) => {
      const cashBean = record.beanFee ? Number(record.beanFee) / 100 : 0;
      return Number(val) + cashBean;
    },
  },
  {
    title: '用户实付卡豆',
    dataIndex: 'beanFee',
    render: (val) => Number(val),
  },
  {
    title: '商户实收',
    dataIndex: 'actualCashFee',
    render: (val, record) => {
      const actualBean = record.actualBeanFee ? Number(record.actualBeanFee) / 100 : 0;
      return Number(val) + actualBean;
    },
  },
  {
    title: '商户实收卡豆',
    dataIndex: 'actualBeanFee',
    render: (val) => Number(val),
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
