import React, { useRef } from 'react';
import { connect } from 'dva';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const ActiveListComponent = (props) => {
  const { activeList, loading, dispatch } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '活动标题',
      fixed: 'left',
      dataIndex: 'coverImg',
      render: (val) => <PopImgShow url={val} />,
    },
    {
      title: '活动链接',
      dataIndex: 'title',
      render: (val) => (
        <Ellipsis length={10} tooltip>
          {val || '--'}
        </Ellipsis>
      ),
    },
    {
      title: '活动位置',
      dataIndex: 'description',
    },
    {
      title: '创建人',
      dataIndex: 'publisherName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      dataIndex: 'newsIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              pop: true,
              visible: record.status === '1',
              title: '下架',
              // click: () => fetchNewsStatus({ newsId: val, status: 0 }),
            },
            {
              type: 'edit',
              title: '修改',
              // click: () => fetchNewsStatus({ newsId: val, status: 0 }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTableBlock
      CardNone={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.newsIdString}`}
      // dispatchType="activeList/fetchGetList"
      {...activeList}
    ></DataTableBlock>
  );
};

export default connect(({ activeList, loading }) => ({
  activeList,
  loading: loading.models.activeList,
}))(ActiveListComponent);
