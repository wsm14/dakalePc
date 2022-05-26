import React from 'react';
import { Alert } from 'antd';
import { checkCityName } from '@/utils/utils';
import { SUPPLIER_AUTH_TYPE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SettlementInfo = (props) => {
  const { detail } = props;

  const itemArr = [
    {
      label: '收货人',
      name: ['supplierObject', 'type'],
      render: (val) => SUPPLIER_AUTH_TYPE[val],
    },
    {
      label: '手机号码',
      name: 'supplierName',
    },
    {
      label: '所在地区',
      name: 'identifyId',
      render: (val) => checkCityName(val),
    },
    {
      label: '详细地址',
      name: ['supplierObject', 'classifyNames'],
    },
  ];

  return (
    <>
      <Alert
        message="显示近10条结算记录"
        type="success"
        action={'UNDO'}
        style={{ marginBottom: 10 }}
      />
      <DescriptionsCondition formItems={itemArr} initialValues={detail}></DescriptionsCondition>
    </>
  );
};

export default SettlementInfo;
