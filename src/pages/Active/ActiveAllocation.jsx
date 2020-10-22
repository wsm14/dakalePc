import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Button, Card } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import activeAllocationEdit from './components/allocation/ActiveAllocationEdit';
import ActiveAllocationPlace from './components/allocation/ActiveAllocationPlace';
import AllocationSet from './components/allocation/AllocationSet';

const tabList = [
  {
    key: 'IOS',
    tab: 'IOS',
  },
  {
    key: 'android',
    tab: 'Android',
  },
  {
    key: 'wechat',
    tab: '小程序',
  },
];

const ActiveAllocation = (props) => {
  const { activeAllocation, loading, dispatch } = props;

  const childRef = useRef();
  const [visibleSet, setVisibleSet] = useState({ show: false });
  const [rowKey, setRowKey] = useState([]);
  const [userOs, setUserOs] = useState('IOS');

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
      title: '版本号',
      dataIndex: 'version',
      render: (val) => `v${val}`,
    },
    // {
    //   title: '操作',
    //   dataIndex: 'id',
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
      payload: {
        page: 1,
        limit: 10,
        ...payload,
      },
    });
  };

  useEffect(() => {
    childRef.current.fetchGetData();
  }, [userOs]);

  return (
    <>
      <Card tabList={tabList} activeTabKey={userOs} onTabChange={(key) => setUserOs(key)}>
        <DataTableBlock
          NoSearch={true}
          CardNone={false}
          cRef={childRef}
          loading={loading}
          columns={getColumns}
          rowKey={(record) => `${record.version}`}
          dispatchType="activeAllocation/fetchGetList"
          params={{ userOs }}
          expandable={{
            expandedRowKeys: rowKey,
            onExpand: (expanded, record) => {
              if (expanded) {
                const { version: promotionVersion } = record;
                setRowKey([promotionVersion]);
                fetchGetAllocationPlace({ userOs, promotionVersion });
              } else {
                setRowKey([]);
              }
            },
            expandedRowRender: (record) => (
              <ActiveAllocationPlace
                userOs={userOs}
                promotionVersion={record.version}
                setVisibleSet={setVisibleSet}
              />
            ),
          }}
          {...activeAllocation}
        ></DataTableBlock>
      </Card>
      <AllocationSet
        {...visibleSet}
        userOs={userOs}
        onClose={() => setVisibleSet({ show: false })}
      ></AllocationSet>
    </>
  );
};

export default connect(({ activeAllocation, loading }) => ({
  activeAllocation,
  loading: loading.effects['activeAllocation/fetchGetList'],
}))(ActiveAllocation);
