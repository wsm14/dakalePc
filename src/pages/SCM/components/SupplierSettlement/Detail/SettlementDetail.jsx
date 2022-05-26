import React from 'react';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SettlementDetail = ({ detail = {} }) => {
  const detailItems = [
    {
      label: '供应商名称',
      name: 'supplierName',
    },
    {
      label: '收款方户名',
      name: 'ownerName',
    },
    {
      label: '收款方账号',
      name: 'paysscount',
    },
    {
      label: '收款方银行',
      name: 'coupo3nName',
    },
    {
      label: '结算金额(元)',
      name: 'settleAmount',
    },
    {
      label: '付款方账号',
      name: 'payerAccount',
    },
    {
      label: '结算流水号',
      name: 'settleNum',
    },
    {
      label: '交易时间',
      name: 'settleTime',
    },
    {
      label: '凭证',
      type: 'upload',
      name: 'certificate',
    },
    {
      label: '备注',
      name: 'remarks',
    },
  ];

  return (
    <DescriptionsCondition formItems={detailItems} initialValues={detail}></DescriptionsCondition>
  );
};

export default SettlementDetail;
