import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import AllocationDetailList from './components/allocation/AllocationDetailList';
import activeAllocationEdit from './components/allocation/ActiveAllocationEdit';
import ActiveAllocationPlace from './components/allocation/ActiveAllocationPlace';
import AllocationSet from './components/allocation/AllocationSet';

const ActiveAllocation = (props) => {
  const { activeAllocation, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');
  const [visibleSet, setVisibleSet] = useState({ show: false });
  const [rowKey, setRowKey] = useState([]);

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
      title: 'IOS',
      dataIndex: 'iosVersion',
      render: (val) => `< v${val}`,
    },
    {
      title: 'Android',
      dataIndex: 'androidVersion',
      render: (val) => `< v${val}`,
    },
    {
      title: '小程序',
      dataIndex: 'appletVersion',
      render: (val) => `< v${val}`,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
    },
    // {
    //   title: '操作',
    //   dataIndex: 'promotionVersionString',
    //   align: 'right',
    //   render: (val, record) => (
    //     <HandleSetTable
    //       formItems={[
    //         // {
    //         //   type: 'own',
    //         //   title: '添加位置',
    //         //   click: () => handleSet({ record }),
    //         // },
    //         {
    //           type: 'own',
    //           title: '配置',
    //           click: () => setVisibleSet({ show: true, promotionId: val, record }),
    //         },
    //       ]}
    //     />
    //   ),
    // },
  ];

  // 获取配置详情列表
  const fetchGetAllocationPlace = (payload) => {
    dispatch({
      type: 'activeAllocationPlace/fetchGetList',
      payload,
    });
  };

  return (
    <>
      <DataTableBlock
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.promotionVersionString}`}
        dispatchType="activeAllocation/fetchGetList"
        expandable={{
          expandedRowKeys: rowKey,
          onExpand: (expanded, record) => {
            if (expanded) {
              const { promotionVersionString: promotionVersionId } = record;
              setRowKey([promotionVersionId]);
              fetchGetAllocationPlace({ promotionVersionId });
            } else {
              setRowKey([]);
            }
          },
          expandedRowRender: (record) => (
            <ActiveAllocationPlace
              promotionVersionId={record.promotionVersionString}
              showDetail={setVisible}
            />
          ),
        }}
        {...activeAllocation}
      ></DataTableBlock>
      <AllocationDetailList visible={visible} setVisible={setVisible}></AllocationDetailList>
      <AllocationSet
        {...visibleSet}
        childRef={childRef}
        onClose={() => setVisibleSet({ show: false })}
      ></AllocationSet>
    </>
  );
};

export default connect(({ activeAllocation, loading }) => ({
  activeAllocation,
  loading: loading.effects['activeAllocation/fetchGetList'],
}))(ActiveAllocation);
