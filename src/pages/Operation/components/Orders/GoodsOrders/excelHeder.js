import { ORDERS_STATUS, ORDERS_TYPE, ORDER_CLOSE_TYPE } from '@/common/constant';

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
    title: '购买商品',
    dataIndex: 'goodsName',
  },
  {
    title: '购买数量',
    dataIndex: 'goodsCount',
  },
  {
    title: '用户支付',
    dataIndex: 'payFee',
    render: (val, record) => `${val}（含${record.beanFee ? record.beanFee : 0}卡豆）`,
  },
  {
    title: '商品佣金',
    dataIndex: 'cashCommission',
    render: (val, record) => {
      const beanCount = record.beanCommission ? record.beanCommission / 100 : 0;
      return `${Number(val) + beanCount ? (Number(val) + beanCount).toFixed(2) : 0}`;
    },
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
  },
  {
    title: '核销时间',
    dataIndex: 'verificationTime',
  },
  {
    title: '核销数',
    dataIndex: 'verificationCount',
  },
  {
    title: '店铺实收',
    dataIndex: 'actualCashFee',
    render: (val, record) => `${val}（含${record.actualBeanFee ? record.actualBeanFee : 0}卡豆）`,
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

  {
    title: '订单属性',
    dataIndex: 'orderType',
    render: (val) => ORDERS_TYPE[val],
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (val) => ORDERS_STATUS[val],
  },
  {
    title: '订单关闭类型',
    dataIndex: 'closeType',
    render: (val) => ORDER_CLOSE_TYPE[val] || '--',
  },
];
