import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import { NEWUSER_STATUS_TYPE } from '@/common/constant';
import TaskConfigDrawerSet from './components/TaskConfigDrawerSet';

const tabList = [
  {
    key: 'newTask',
    tab: '新手任务',
  },
  {
    key: 'everyTask',
    tab: '每日任务',
  },
];

const TaskConfig = (props) => {
  const { taskConfigList, loading, dispatch } = props;
  const childRef = useRef();
  //tab切换
  const [tabKey, setTabKey] = useState('newTask');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ userOs: tabKey });
  }, [tabKey]);

  const getColumns = [
    {
      title: '任务名称/ID',
      align: 'center',
      dataIndex: 'name',
      render: (val, row) => (
        <div>
          <div>{val}</div>
          <div style={{ color: '#999' }}>{row.id}</div>
        </div>
      ),
    },
    {
      title: '获得金币数',
      dataIndex: 'jinbi',
      align: 'center',
      render: (val, row) => val,
    },
    {
      type: 'handle',
      dataIndex: 'configNewUserPopUpId',
      align: 'center',
      render: (val, row) => {
        return [
          {
            title: '关联链接',
            type: 'taskConfigLink',
            click: () => handleEdit(val, 'taskLink'),
          },
          {
            title: '详情',
            type: 'taskConfigInfo',
            click: () => handleEdit(val, 'info'),
          },
          {
            title: '编辑',
            type: 'taskConfigEdit',
            click: () => handleEdit(val, 'edit'),
          },
        ];
      },
    },
  ];

  // 编辑 ， 关联链接
  const handleEdit = (val, type) => {
    setVisible({ show: true, type });
  };

  // 任务完成配置
  const handleTaskOkConfig = (type) => {
    setVisible({ show: true, type });
  };

  const extraBtn = [
    {
      auth: 'taskOkConfig',
      text: '任务完成配置',
      className: 'dkl_blue_btn',
      onClick: () => handleTaskOkConfig('taskOk'),
    },
  ];

  return (
    <>
      <TableDataBlock
        cardProps={{
          tabList: tabList,
          activeTabKey: tabKey,
          onTabChange: setTabKey,
          bordered: false,
        }}
        btnExtra={extraBtn}
        pagination={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.id}`}
        dispatchType="marketConfigure/fetchListConfigTask"
        params={{ userOs: tabKey }}
        {...taskConfigList}
      ></TableDataBlock>
      <TaskConfigDrawerSet
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></TaskConfigDrawerSet>
    </>
  );
};
export default connect(({ loading, marketConfigure }) => ({
  taskConfigList: marketConfigure.taskConfigList,
  loading: loading.effects['marketConfigure/fetchListConfigTask'],
}))(TaskConfig);
