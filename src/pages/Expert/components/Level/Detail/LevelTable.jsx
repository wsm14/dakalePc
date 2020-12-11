import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import PopImgShow from '@/components/PopImgShow';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const LevelTable = (props) => {
  const { list, type, loading } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

  // table 表头
  const getColumns = [
    {
      title: '序号',
      dataIndex: 'icon',
      render: (val, item, i) => i + 1,
    },
    {
      title: `等级${type == 'rights' ? '权益' : '任务'}`,
      dataIndex: 'title',
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'rights',
      render: (val, row) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                click: () => setVisible({ show: true, type: '' }),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <DataTableBlock
      CardNone={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.levelConfigId}`}
      list={list}
      pagination={false}
    ></DataTableBlock>
  );
};

export default connect(({}) => ({}))(LevelTable);
