import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const BoxDetail = (props) => {
  const { initialValues } = props;

  const formItems = [
    {
      label: '物流公司',
      name: 'logisticsCompany',
    },
    {
      label: '物流单号',
      name: 'logisticsNum',
    },
    {
      label: '发货时间',
      name: 'deliveryTime',
    },
    {
      label: '收货信息',
      name: 'receivingInfo',
    },
  ];
  return (
    <DescriptionsCondition
      formItems={formItems}
      initialValues={initialValues}
    ></DescriptionsCondition>
  );
};

export default BoxDetail;
