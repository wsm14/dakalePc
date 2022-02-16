import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';
import { checkCityName } from '@/utils/utils';
import AddressDrawer from './AddressDrawer';

const OrderPushSet = (props) => {
  const { form, initialValues, dispatch } = props;
  const { orderId } = initialValues;

  const [orderLogistics, setOrderLogistics] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    !visible &&
      dispatch({
        type: 'ordersList/fetchOrderDetail',
        payload: { orderId },
        callback: (detail) => {
          const { orderLogistics } = detail;
          setOrderLogistics(orderLogistics);
        },
      });
  }, [orderId, visible]);
  const formItems = [
    {
      label: '物流公司',
      name: ['orderLogistics', 'logisticsCompany'],
    },
    {
      label: '物流单号',
      name: ['orderLogistics', 'logisticsCode'],
    },
    {
      label: '买家收货信息',
      type: 'noForm',
      name: 'goodsName',
      formItem: (
        <div style={{ marginLeft: 80, display: 'flex', alignItems: 'center' }}>
          买家收货信息：
          {`${orderLogistics?.addressName || '--'}，${
            orderLogistics?.mobile || '--'
          }，${checkCityName(orderLogistics?.districtCode)}${orderLogistics?.address}，${
            orderLogistics?.logisticsCode
          }`}
          <Typography.Link onClick={() => handelModal()}>修改</Typography.Link>
        </div>
      ),
    },
  ];

  const handelModal = () => {
    const { provinceCode, cityCode, districtCode } = orderLogistics;
    setVisible({
      show: true,
      detail: {
        ...orderLogistics,
        orderId,
        city: [provinceCode, cityCode, districtCode],
      },
    });
  };

  return (
    <>
      <FormCondition form={form} formItems={formItems}></FormCondition>
      {/* 修改地址 */}
      <AddressDrawer visible={visible} onClose={() => setVisible(false)}></AddressDrawer>
    </>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['ordersList/fetchOrderDetail'],
}))(OrderPushSet);
