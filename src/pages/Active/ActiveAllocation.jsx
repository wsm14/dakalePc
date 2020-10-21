import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import AllocationDetailList from './components/allocation/AllocationDetailList';
import activeAllocationEdit from './components/allocation/ActiveAllocationEdit';

const ActiveAllocation = (props) => {
  const { activeAllocation, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

  // 新增/修改
  const handleSet = (initialValues) => {
    dispatch({
      type: 'drawerForm/show',
      payload: activeAllocationEdit({ dispatch, childRef, initialValues }),
    });
  };

  // table 表头
  const getColumns = [
    {
      title: '活动位置',
      dataIndex: 'name',
    },
    {
      title: '操作',
      dataIndex: 'type',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '配置',
              click: () => setVisible({ record }),
            },
            {
              type: 'edit',
              click: () => handleSet(record),
            },
            {
              type: 'del',
              click: () => handleSet(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <DataTableBlock
        btnExtra={
          <Button className="dkl_green_btn" onClick={() => handleSet()}>
            新增
          </Button>
        }
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.type}`}
        dispatchType="activeAllocation/fetchGetList"
        {...activeAllocation}
      ></DataTableBlock>
      <AllocationDetailList visible={visible} setVisible={setVisible}></AllocationDetailList>
    </>
  );
};

export default connect(({ activeAllocation, loading }) => ({
  activeAllocation,
  loading: loading.effects['activeAllocation/fetchGetList'],
}))(ActiveAllocation);
