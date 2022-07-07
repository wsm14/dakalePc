import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';
import { checkCityName } from '@/utils/utils';
import AddressDrawer from './AddressDrawer';

const OrderPushSet = (props) => {
  const { form, initialValues, dispatch, companyList } = props;
  const { orderId, userId } = initialValues;

  const [orderLogistic, setOrderLogistic] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    !visible &&
      orderId &&
      dispatch({
        type: 'ordersList/fetchGetOrderDetail',
        payload: { orderId, userId },
        callback: (detail) => {
          const { orderLogisticInfo } = detail;
          setOrderLogistic(orderLogisticInfo);
        },
      });
  }, [orderId, visible]);

  const formItems = [
    {
      label: '物流公司',
      name: ['orderLogistic', 'companyCode'],
      type: 'select',
      select: companyList,
      fieldNames: { label: 'companyName', value: 'companyCode' },
      onSelect: (val, option) => {
        option &&
          form.setFieldsValue({
            orderLogistic: {
              logisticsCompany: option.option.companyName,
            },
          });
      },
    },
    {
      label: '物流单号',
      name: ['orderLogistic', 'logisticsCode'],
    },
    {
      label: '物流公司名称',
      name: ['orderLogistic', 'logisticsCompany'],
      hidden: true,
    },
    {
      label: '买家收货信息',
      type: 'noForm',
      name: 'goodsName',
      formItem: (
        <div style={{ marginLeft: 80, display: 'flex', alignItems: 'center' }}>
          买家收货信息：
          {`${orderLogistic?.addressName || '--'}，${
            orderLogistic?.mobile || '--'
          }，${checkCityName(orderLogistic?.districtCode)}${orderLogistic?.address}
          `}
          <Typography.Link onClick={() => handelModal()}>修改</Typography.Link>
        </div>
      ),
    },
  ];

  const handelModal = () => {
    const { provinceCode, cityCode, districtCode } = orderLogistic;
    setVisible({
      show: true,
      detail: {
        ...orderLogistic,
        orderId,
        userId,
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

export default connect(({ baseData, loading }) => ({
  companyList: baseData.companyList,
  loading: loading.effects['ordersList/fetchOrderDetail'],
}))(OrderPushSet);
