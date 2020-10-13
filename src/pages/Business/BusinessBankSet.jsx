import React, { useRef } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import bankSet from './components/BankSet/businessBankSet';

const BusinessBankSetContent = (props) => {
  const { businessBankSet, loading, dispatch } = props;

  const childRef = useRef();
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
              click: () => handleBankSet(record),
            },
          ]}
        />
      ),
    },
  ];

  // 新增
  const handleBankSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: bankSet({ dispatch, childRef, initialValues }),
    });
  };

  return (
    <DataTableBlock
      btnExtra={
        <Button className="dkl_green_btn" key="1" onClick={() => handleBankSet()}>
          新增
        </Button>
      }
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.bankBranchIdString}`}
      dispatchType="businessBankSet/fetchGetList"
      {...businessBankSet}
    ></DataTableBlock>
  );
};

export default connect(({ businessBankSet, loading }) => ({
  businessBankSet,
  loading: loading.models.businessBankSet,
}))(BusinessBankSetContent);
