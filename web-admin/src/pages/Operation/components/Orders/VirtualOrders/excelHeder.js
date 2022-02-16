import { checkCityName } from '@/utils/utils';
import { ORDERS_STATUS, ORDER_TYPE_PROPS, ORDER_CLOSE_TYPE } from '@/common/constant';

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
    title: '购买商品',
    dataIndex: 'goodsName',
  },
  // {
  //   title: '购买数量',
  //   dataIndex: 'goodsCount',
  // },
  {
    title: '充值帐号',
    dataIndex: 'virtualProductAccount',
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
    title: '用户实付现金',
    dataIndex: 'payFee',
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
  },
  {
    title: '下单渠道',
    dataIndex: 'orderSource',
  },
  // {
  //   title: '区域',
  //   dataIndex: 'merchantDistrict',
  //   render: (val) => checkCityName(val),
  // },
  // {
  //   title: '订单属性',
  //   dataIndex: 'orderType',
  //   render: (val) => ORDER_TYPE_PROPS[val],
  // },
  {
    title: '状态',
    dataIndex: 'status',
    render: (val) => ORDERS_STATUS[val],
  },
  // {
  //   title: '订单关闭类型',
  //   dataIndex: 'closeType',
  //   render: (val, row) => (row.status != 3 ? ORDER_CLOSE_TYPE[val] || '--' : '--'),
  // },
];
