import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const ActiveAllocationPlace = (props) => {
  const { activeAllocationPlace, loading, promotionVersionId, showDetail } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '位置',
      name: 'promotionPage',
      type: 'select',
      select: { list: [{ value: 'main', name: '首页' }] },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '名称',
      dataIndex: 'promotionTypeName',
    },
    {
      title: '位置',
      dataIndex: 'promotionPage',
    },
    {
      title: '备注',
      dataIndex: 'promotionDesc',
    },
    {
      title: '位置图片',
      dataIndex: 'promotionImage',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '操作',
      dataIndex: 'promotionType',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '配置',
              click: () => showDetail({ show: true, promotionVersionId, record }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTableBlock
      NoSearch={true}
      CardNone={false}
      componentSize="middle"
      searchItems={searchItems}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.promotionType}`}
      params={{ promotionVersionId }}
      dispatchType="activeAllocationPlace/fetchGetList"
      {...activeAllocationPlace}
    ></DataTableBlock>
  );
};

export default connect(({ activeAllocationPlace, loading }) => ({
  activeAllocationPlace,
  loading: loading.effects['activeAllocationPlace/fetchGetList'],
}))(ActiveAllocationPlace);
