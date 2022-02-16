import React from 'react';
import { Modal } from 'antd';
import ProvCompanyTotalInfo from './IncomeTotal';

const ProvCompanyDetailList = (props) => {
  const { visible, setVisible } = props;

  const { type = 'income', record = '' } = visible;

  // table
  const propItem = {
    income: {
      title: `收益数据 - ${record.companyName}`,
    },
  }[type];

  return (
    <Modal
      title={propItem.title}
      width={1150}
      destroyOnClose
      footer={null}
      visible={visible}
      onCancel={() => setVisible('')}
    >
      <ProvCompanyTotalInfo companyId={record.companyId}></ProvCompanyTotalInfo>
    </Modal>
  );
};

export default ProvCompanyDetailList;
