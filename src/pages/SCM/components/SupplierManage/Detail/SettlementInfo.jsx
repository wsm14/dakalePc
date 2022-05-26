import React from 'react';
import { Alert } from 'antd';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SettlementInfo = (props) => {
  const { detail = {} } = props;
  const { list = [] } = detail;

  const itemArr = [
    {
      label: '结算金额',
      name: 'settleAmount',
    },
    {
      label: '收款方户名',
      name: 'legalPerson',
    },
    {
      label: '收款方账号',
      name: 'cardNo',
    },
    {
      label: '收款方银行',
      name: 'bankBranchName',
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
    <>
      <Alert
        type="success"
        message="显示近10条结算记录"
        // action={'UNDO'}
        style={{ marginBottom: 10 }}
      />
      {list.map((data) => (
        <DescriptionsCondition formItems={itemArr} initialValues={data}></DescriptionsCondition>
      ))}
    </>
  );
};

export default SettlementInfo;
