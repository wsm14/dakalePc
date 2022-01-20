import { ORDERS_STATUS } from '@/common/constant';

// 导出表头
export default [
  {
    title: '订单号',
    dataIndex: 'orderSn',
  },
  {
    title: '团购标题',
    dataIndex: 'organizationGoodsOrderDescObject',
    render: (val) => val?.title,
  },
  {
    title: '跟团号',
    dataIndex: 'organizationGoodsOrderDescObject',
    render: (val) => val?.organizationNumber,
  },
  {
    title: '商品详情',
    dataIndex: 'organizationGoodsOrderDescObject',
    render: (val) =>
      val?.communityGoodsList?.reduce(
        (preValue, curValue) =>
          preValue +
          `商品名称：${curValue?.goodsName || ''} 规格：${
            curValue?.specificationData?.specificationMap['尺码'] || ''
          } 数量：${curValue?.goodsCount || ''}； `,
        '',
      ) || '',
  },
  {
    title: '订单总金额',
    dataIndex: 'totalFee',
    render: (val) => `￥${val}`,
  },
  {
    title: '用户实付现金',
    dataIndex: 'payFee',
    render: (val) => `￥${val}`,
  },
  {
    title: '用户实付卡豆',
    dataIndex: 'beanFee',
  },
  {
    title: '团长手机号',
    dataIndex: 'relateOwnerMobile',
  },
  {
    title: '团长昵称',
    dataIndex: 'organizationGoodsOrderDescObject',
    render: (val) => val?.relateOwnerName,
  },
  {
    title: '下单人ID',
    dataIndex: 'userIdString',
  },
  {
    title: '下单人昵称',
    dataIndex: 'userName',
  },
  {
    title: '买家姓名',
    dataIndex: 'organizationGoodsOrderDescObject',
    render: (val) => `${val?.writeContactPerson}`,
  },
  {
    title: '买家手机号',
    dataIndex: 'organizationGoodsOrderDescObject',
    render: (val) => `${val?.writeMobile}`,
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    render: (val, row) => ORDERS_STATUS[val],
  },
  {
    title: '订单创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '订单支付时间',
    dataIndex: 'payTime',
  },
  {
    title: '订单完成时间',
    dataIndex: 'verificationTime',
  },
  {
    title: '订单关闭时间',
    dataIndex: 'closeTime',
  },
  {
    title: '订单关闭原因',
    dataIndex: 'closeReason',
  },
  {
    title: '订单备注',
    dataIndex: 'remark',
  },
];
