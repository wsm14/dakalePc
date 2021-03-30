import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
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
      title: '编辑时间',
      align: 'center',
      dataIndex: 'updateTimeString',
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'bankBranchIdString',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'edit',
              click: () => setVisible({ show: true, info: record }),
            },
          ]}
        />
      ),
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

  return (
    <>
      <TableDataBlock
        btnExtra={
          <AuthConsumer auth="save">
            <Button className="dkl_green_btn" onClick={() => setVisible({ show: true, info: {} })}>
              新增
            </Button>
          </AuthConsumer>
        }
        cRef={childRef}
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
