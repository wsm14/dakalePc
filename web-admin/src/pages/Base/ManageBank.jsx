import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import BankSet from './components/BankSet/BusinessBankSet';

const BusinessBankSetContent = (props) => {
  const { businessBankSet, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState({ show: false, info: {} });

  // 搜索参数
  const searchItems = [
    {
      label: '支行名称',
      name: 'branchName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '支行名称',
      dataIndex: 'bankBranchName',
    },
    {
      title: '总行编号',
      dataIndex: 'bankCode',
    },
    {
      title: '编辑时间',
      align: 'center',
      dataIndex: 'updateTimeString',
    },
    {
      type: 'handle',
      dataIndex: 'bankBranchIdString',
      render: (val, record) => [
        {
          type: 'edit',
          click: () => setVisible({ show: true, info: record }),
        },
      ],
    },
  ];

  // 获取总行列表
  const fetchMerBankTop = () => {
    dispatch({
      type: 'businessBankSet/fetchMerBankTop',
    });
  };

  useEffect(() => {
    fetchMerBankTop();
  }, []);

  // 表格额外按钮
  const extraBtn = [{ auth: 'save', onClick: () => setVisible({ show: true, info: {} }) }];

  return (
    <>
      <TableDataBlock
        cRef={childRef}
        btnExtra={extraBtn}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.bankBranchIdString}`}
        dispatchType="businessBankSet/fetchGetList"
        {...businessBankSet}
      ></TableDataBlock>
      <BankSet
        cRef={childRef}
        bankTopArr={businessBankSet.bankTopArr}
        initialValues={visible.info}
        visible={visible.show}
        onClose={() => setVisible({ show: false, info: {} })}
      ></BankSet>
    </>
  );
};

export default connect(({ businessBankSet, loading }) => ({
  businessBankSet,
  loading: loading.models.businessBankSet,
}))(BusinessBankSetContent);
