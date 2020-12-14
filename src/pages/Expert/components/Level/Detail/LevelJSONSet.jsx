import React from 'react';
import { connect } from 'dva';
import { Drawer } from 'antd';
import { rightsJson } from '@/common/expertLevelJSON';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const LevelJSONSet = (props) => {
  const { show, showlistData, keyRow, onCancel, loading, fetchExpertLevelSet } = props;

  // table
  const propItem = {
    target: {
      title: `任务库`,
      dataKey: 'target',
    },
    rights: {
      title: `权益库`,
      dataKey: 'rights',
      list: rightsJson,
      getColumns: [
        {
          title: '序号',
          dataIndex: 'icon',
          render: (val, row, i) => i + 1,
        },
        {
          title: `等级${keyRow == 'rights' ? '权益' : '任务'}`,
          dataIndex: 'title',
        },
        {
          title: `添加状态`,
          dataIndex: 'value',
          render: (val, row) => {
            if (showlistData.some((item) => item.title == row.title)) {
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
            const checkAdd = showlistData.some((item) => item.title == row.title);
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
                      const newList = showlistData.filter((item) => item.title != row.title);
                      fetchExpertLevelSet(newList);
                    },
                  },
                ]}
              />
            );
          },
        },
      ],
    },
  }[keyRow];

  const modalProps = {
    title: propItem.title,
    width: 700,
    visible: show,
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer {...modalProps} onClose={onCancel}>
      <DataTableBlock
        componentSize={'small'}
        CardNone={false}
        loading={loading}
        columns={propItem.getColumns}
        rowKey={(record) => `${record.title}`}
        list={propItem.list}
        pagination={false}
      ></DataTableBlock>
    </Drawer>
  );
};

export default connect(({ loading }) => ({ loading: loading.models.expertLevel }))(LevelJSONSet);
