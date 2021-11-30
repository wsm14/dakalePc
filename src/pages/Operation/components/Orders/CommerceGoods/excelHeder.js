import { checkCityName } from '@/utils/utils';
import { COMMERCE_ORDERS_STATUS } from '@/common/constant';

// 导出表头
export default [
  {
    title: '订单号',
    dataIndex: 'orderSn',
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
  },
  {
    title: '下单用户昵称',
    dataIndex: 'userName',
  },
  {
    title: '用户手机号',
    dataIndex: 'userMobile',
  },
  {
    title: '用户豆号',
    dataIndex: 'beanCode',
  },
  {
    title: '单价',
    dataIndex: 'realPrice',
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
      return Number(val) + cashBean;
    },
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
  },
  {
    title: '发货时间',
    dataIndex: 'orderLogistics',
    render: (val) => val.deliveryTime,
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    render: (val) => COMMERCE_ORDERS_STATUS[val],
  },
  {
    title: '收货信息',
    dataIndex: 'orderLogistics',
    render: (val) =>
      `${val?.addressName},${val?.mobile},${checkCityName(val?.districtCode)},${val?.address}`,
  },
  {
    title: '物流公司',
    dataIndex: 'orderLogistics',
    render: (val) => val?.logisticsCompany,
  },
  {
    title: '物流单号',
    dataIndex: 'orderLogistics',
    render: (val) => val?.logisticsCode,
  },
];
