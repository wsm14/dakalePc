import React from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import ProvCompanyTotalInfo from './IncomeTotal';

const ProvCompanyDetailList = (props) => {
  const { detailList, loading, visible, setVisible } = props;

  const { type = 'income', record = '' } = visible;

  // table
  const propItem = {
    income: {
      title: `收益数据`,
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
      <ProvCompanyTotalInfo></ProvCompanyTotalInfo>
    </Modal>
  );
};

export default connect(({ provCompany, loading }) => ({
  detailList: provCompany.detailList,
  loading: loading.models.provCompany,
}))(ProvCompanyDetailList);
