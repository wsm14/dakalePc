import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { handleZipDown } from './components/MaterialConfig/downZip';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import CodeDrawerSet from './components/MaterialConfig/Form/CodeDrawerSet';

const tabList = [
  {
    key: 'user',
    tab: '用户码',
  },
  {
    key: 'merchant',
    tab: '商家码',
  },
];

const MaterialConfig = ({ materialConfig, loading }) => {
  const tableRef = useRef();
  const [tabKey, setTabKey] = useState('user');
  const [visibleSet, setVisibleSet] = useState(false);

  useEffect(() => {
    tableRef.current.fetchGetData({ matterType: tabKey });
  }, [tabKey]);

  const searchItems = [
    {
      label: '配置名称',
      name: 'matterName',
    },
  ];

  const getColumns = [
    {
      title: '配置名称',
      dataIndex: 'matterName',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      type: 'handle',
      dataIndex: 'url',
      render: (val) => [
        {
          type: 'download',
          click: () => handleZipDown(val),
        },
      ],
    },
  ];

  //  新增/编辑
  const handleUpdateSet = () => {
    setVisibleSet({
      show: true,
      tabKey,
    });
  };

  const cardBtnList = [
    {
      text: '新增',
      auth: 'save',
      onClick: handleUpdateSet,
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
          tabBarExtraContent: <ExtraButton list={cardBtnList}></ExtraButton>,
        }}
        cRef={tableRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.matterConfigId}`}
        dispatchType="materialConfig/fetchGetList"
        params={{ matterType: tabKey }}
        {...materialConfig}
      ></TableDataBlock>
      {/* 新增/编辑 */}
      <CodeDrawerSet
        visible={visibleSet}
        childRef={tableRef}
        onClose={() => setVisibleSet(false)}
      ></CodeDrawerSet>
    </>
  );
};
export default connect(({ materialConfig, loading }) => ({
  materialConfig,
  loading: loading.models.materialConfig,
}))(MaterialConfig);
