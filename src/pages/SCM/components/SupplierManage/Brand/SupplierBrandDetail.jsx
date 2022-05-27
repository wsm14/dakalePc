import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SupplierBrandDetail = ({ detail = {} }) => {
  const detailItems = [
    {
      label: '品牌名称',
      name: 'brandName',
    },
    {
      label: '授权单位',
      name: 'authorizeCompany',
    },
    {
      label: '授权期限',
      name: 'startDate',
      render: (val, row) => `${val} ~ ${row.endDate}`,
    },
    {
      label: '授权证书',
      name: 'authorizeImg',
      type: 'upload',
    },
    {
      label: '授权状态',
      name: 'status',
      render: (val) => ['失效', '有效'][val],
    },
  ];

  return (
    <DescriptionsCondition formItems={detailItems} initialValues={detail}></DescriptionsCondition>
  );
};

export default SupplierBrandDetail;
