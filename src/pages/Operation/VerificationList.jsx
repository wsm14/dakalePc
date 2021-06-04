import React, { useRef } from 'react';
import { connect } from 'umi';
import { Tag, Badge } from 'antd';
import { ORDERS_TYPE, GOODS_CLASS_TYPE, ORDER_TYPE_PROPS } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import PopImgShow from '@/components/PopImgShow';
import Ellipsis from '@/components/Ellipsis';
import coupon from './img/coupon.png';

const VerificationList = (props) => {
  const { verificationList, loading } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '订单号',
      name: 'orderSn',
    },
    {
      label: '下单人',
      name: 'userId',
      type: 'user',
    },
    {
      label: '店铺名',
      name: 'merchantId',
      type: 'merchant',
    },
    {
      label: '商品名称',
      name: 'goodsName',
    },
    {
      label: '订单属性',
      type: 'select',
      name: 'orderType',
      select: ORDERS_TYPE,
    },
    {
      label: '核销日期',
      type: 'rangePicker',
      name: 'verificationTimeStart',
      end: 'verificationTimeEnd',
    },
    {
      label: '区域',
      name: 'city',
      type: 'cascader',
      changeOnSelect: true,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
  ];

  // table 表头
  //
  const getColumns = [
    {
      title: '商品',
      dataIndex: 'goodsImg',
      render: (val, row) => (
        <Badge.Ribbon text={ORDER_TYPE_PROPS[row.orderType]} color="cyan" placement="start">
          <PopImgShow url={row.goodsImg || coupon} onClick={row.goodsImg ? null : () => {}}>
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {row.goodsType && row.goodsType !== 'reduce' && (
                  <Tag color="magenta">{GOODS_CLASS_TYPE[row.goodsType]}</Tag>
                )}
                <Ellipsis length={10} tooltip>
                  {row.goodsName}
                </Ellipsis>
              </div>

              <div style={{ marginTop: 5 }}>订单号：{row.orderSn}</div>
            </div>
          </PopImgShow>
        </Badge.Ribbon>
      ),
    },
    {
      title: '店铺',
      dataIndex: 'merchantName',
      render: (val, row) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* //账号 */}
          <div>账号:{row.merchantMobile}</div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <Tag color="magenta">单店</Tag>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div>{`${row.provinceName}-${row.cityName}-${row.districtName}`}</div>
        </div>
      ),
    },
    {
      title: '下单人',
      dataIndex: 'userMobile',
      render: (val, row) => (
        <div style={{ textAlign: 'center' }}>
          <div>{row.userName}</div>
          <div>{val}</div>
        </div>
      ),
    },

    {
      title: '用户实付',
      align: 'center',
      dataIndex: 'verificationTotalFee',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${val}`}</div>
          <div>
            {+record.verificationBeanFee ? `(${record.verificationBeanFee}卡豆` : '(' + '0卡豆'}
          </div>
          <div>{(record.verificationPayFee ? `+ ￥${record.verificationPayFee}` : 0) + ')'}</div>
        </div>
      ),
    },
    {
      title: '商户实收',
      align: 'center',
      dataIndex: 'merchantCash',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${record.merchantTotalBean}`}</div>
          <div>{+record.merchantBean ? `(${record.merchantBean}卡豆` : '(' + '0卡豆'}</div>
          <div>{(val ? `+ ￥${val}` : 0) + ')'}</div>
        </div>
      ),
    },
    {
      title: '商品佣金',
      align: 'center',
      dataIndex: 'cashCommission',
      render: (val, record) => (
        <div style={{ textAlign: 'center' }}>
          <div>{`￥${
            (Number(val) + record.beanCommission ? record.beanCommission / 100 : 0)
              ? (Number(val) + record.beanCommission ? record.beanCommission / 100 : 0).toFixed(2)
              : 0
          }`}</div>
          <div>{+record.beanCommission ? `(${record.beanCommission}卡豆` : '(' + '0卡豆'}</div>
          <div>{(val ? `+ ￥${val}` : 0) + ')'}</div>
        </div>
      ),
    },

    {
      title: '下单/核销时间',
      dataIndex: 'verificationTime',
      align: 'center',
    },
    {
      title: '核销码',
      align: 'center',
      dataIndex: 'verificationCode',
    },
  ];

  const extraBtn = ({ get }) => [
    {
      type: 'excel',
      data: { type: 'verificationList', orderGoodsVerificationObject: get() },
    },
  ];

  return (
    <TableDataBlock
      keepData
      btnExtra={extraBtn}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.orderSn}`}
      dispatchType="verificationList/fetchVerificationList"
      {...verificationList}
    ></TableDataBlock>
  );
};

export default connect(({ verificationList, loading }) => ({
  loadings: loading,
  verificationList,

  loading: loading.effects['verificationList/fetchVerificationList'],
}))(VerificationList);
