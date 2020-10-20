import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import AllocationDetailList from './components/allocation/AllocationDetailList';

const ActiveAllocation = (props) => {
  const { activeAllocation, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

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
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <DataTableBlock
        CardNone={false}
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
