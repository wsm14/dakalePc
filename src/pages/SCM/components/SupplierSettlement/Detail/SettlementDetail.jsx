import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SettlementDetail = ({ detail = {} }) => {
  const detailItems = [
    {
      label: '供应商名称',
      name: 'ownerType',
    },
    {
      label: '收款方户名',
      name: 'ownerName',
    },
    {
      label: '收款方账号',
      name: 'merchantIdList',
    },
    {
      label: '收款方银行',
      name: 'coupo3nName',
    },
    {
      label: '结算金额(元)',
      name: 'coupo1nName',
    },
    {
      label: '付款方账号',
      name: 'couponN2ame',
    },
    {
      label: '结算流水号',
      name: 'couposnName',
    },
    {
      label: '交易时间',
      name: 'coupo2nName',
    },
    {
      label: '凭证',
      type: 'upload',
      name: 'couponDetailImg',
    },
    {
      label: '备注',
      name: 'couponDetail',
    },
  ];

  return (
    <DescriptionsCondition formItems={detailItems} initialValues={detail}></DescriptionsCondition>
  );
};

export default SettlementDetail;
