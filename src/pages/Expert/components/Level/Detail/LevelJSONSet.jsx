import React from 'react';
import { connect } from 'umi';
import { Drawer } from 'antd';
import { rightsJson, targetJson } from '@/common/expertLevelJSON';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';

const LevelJSONSet = (props) => {
  const { show, showlistData, keyRow, onCancel, loading, fetchExpertLevelSet } = props;

  // table
  const propItem = {
    target: {
      title: `任务库`,
      dataKey: 'target',
      list: targetJson,
    },
    rights: {
      title: `权益库`,
      dataKey: 'rights',
      list: rightsJson,
    },
  }[keyRow];

  const getColumns = [
    {
      title: `等级${keyRow == 'rights' ? '权益' : '任务'}`,
      dataIndex: 'title',
    },
    {
      title: `添加状态`,
      dataIndex: 'value',
      render: (val, row) => {
        if (showlistData.some((item) => item.name == row.name)) {
          return '已添加';
        }
        return '未添加';
      },
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'name',
      render: (val, row, i) => {
        const checkAdd = showlistData.some((item) => item.name == row.name);
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'own',
                title: '添加',
                pop: true,
                visible: !checkAdd,
                click: () => {
                  fetchExpertLevelSet([...showlistData, row]);
                },
              },
              {
                type: 'own',
                title: '取消添加',
                pop: true,
                visible: checkAdd,
                click: () => {
                  const newList = showlistData.filter((item) => item.name != row.name);
                  fetchExpertLevelSet(newList);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  const modalProps = {
    title: propItem.title,
    width: 700,
    visible: show,
    maskClosable: true,
    destroyOnClose: true,
    zIndex: 1001,
  };

  return (
    <Drawer {...modalProps} onClose={onCancel}>
      <TableDataBlock
        order
        componentSize={'small'}
        noCard={false}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.title}`}
        list={propItem.list}
        pagination={false}
      ></TableDataBlock>
    </Drawer>
  );
};

export default connect(({ loading }) => ({ loading: loading.models.expertLevel }))(LevelJSONSet);
