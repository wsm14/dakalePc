import { checkCityName } from '@/utils/utils';
import { ORDER_STATUS } from '@/common/constant';

// 导出表头
export default [
  {
    title: '订单号',
    dataIndex: 'orderSn',
  },
  {
    title: '商品名称',
    dataIndex: ['orderDesc', 'commerceGoods'],
    render: (val) => `${val?.goodsName}`,
  },
  {
    title: '规格',
    dataIndex: ['orderDesc', 'commerceGoods', 'attributeObjects'],
    render: (val) => (val ? val?.map((item) => item.value).join('/') : ''),
  },
  {
    title: '供应商',
    dataIndex: 'supplierInfo',
    render: (val) => val?.supplierName,
  },
  {
    title: '下单用户昵称',
    dataIndex: 'userInfo',
    render: (val) => val.userName,
  },
  {
    title: '用户手机号',
    dataIndex: 'userInfo',
    render: (val) => val.mobile,
  },
  {
    title: '用户豆号',
    dataIndex: 'userInfo',
    render: (val) => val.beanCode,
  },
  {
    title: '单价',
    dataIndex: ['orderDesc', 'commerceGoods'],
    render: (val) => {
      const num = Number(val?.sellPrice || 0) + Number(val?.sellBean || 0) / 100;
      return `￥${num.toFixed(2) || 0}`;
    },
  },
  {
    title: '购买数量',
    dataIndex: 'goodsCount',
  },
  {
    title: '用户实付（卡豆+现金）',
    dataIndex: 'payFee',
    render: (val, record) => {
      const cashBean = record.beanFee ? Number(record.beanFee) / 100 : 0;
      return (Number(val) + cashBean).toFixed(2);
    },
  },
  {
    title: '供应商实收',
    dataIndex: 'settleParam',
    render: (val) => `￥${val?.settlePrice || 0}`,
  },
  {
    title: '商品佣金',
    dataIndex: 'divisionParam',
    render: (val) => `￥${val?.commission || 0}`,
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
  },
  {
    title: '发货时间',
    dataIndex: 'orderLogistics',
    render: (val) => val?.deliveryTime || '-',
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    render: (val) => ORDER_STATUS[val],
  },
  {
    title: '收货信息',
    dataIndex: 'orderLogisticInfo',
    render: (val) =>
      `${val?.addressName},${val?.mobile},${checkCityName(val?.districtCode)},${val?.address}`,
  },
  {
    title: '物流公司',
    dataIndex: 'orderLogisticInfo',
    render: (val) => val?.logisticsCompany,
  },
  {
    title: '物流单号',
    dataIndex: 'orderLogisticInfo',
    render: (val) => val?.logisticsCode,
  },
];
