import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const OrderDetail = (props) => {
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
  ];
  return (
    <DescriptionsCondition
      formItems={formItems}
      initialValues={initialValues}
    ></DescriptionsCondition>
  );
};

export default OrderDetail;
