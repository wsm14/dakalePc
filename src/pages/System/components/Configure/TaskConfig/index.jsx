import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import ExtraButton from '@/components/ExtraButton';
import TableDataBlock from '@/components/TableDataBlock';
import { NEWUSER_STATUS_TYPE } from '@/common/constant';
import TaskConfigDrawerSet from './components/TaskConfigDrawerSet';

const tabList = [
  {
    key: '1',
    tab: '新手任务',
  },
  {
    key: '2',
    tab: '每日任务',
  },
];

const TaskConfig = (props) => {
  const { taskConfigList, loading, dispatch } = props;
  const childRef = useRef();
  //tab切换
  const [tabKey, setTabKey] = useState('1');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    childRef.current && childRef.current.fetchGetData({ subjectId: tabKey });
  }, [tabKey]);

  const getColumns = [
    {
      title: '任务名称/ID',
      align: 'center',
      dataIndex: 'name',
      render: (val, row) => (
        <div>
          <div>{val}</div>
          <div style={{ color: '#999' }}>{row.subjectTaskRelationId}</div>
        </div>
      ),
    },
    {
      title: '获得金币数',
      dataIndex: 'taskPrizeParamObjects',
      align: 'center',
      render: (val, row) => val[0].value || 0,
    },
    {
      type: 'handle',
      dataIndex: 'subjectTaskRelationId',
      align: 'center',
      render: (val, row) => {
        return [
          {
            title: '详情',
            type: 'taskConfigInfo',
            click: () => handleEdit(row, 'info'),
          },
          {
            title: '编辑',
            type: 'taskConfigEdit',
            click: () => handleEdit(row, 'edit'),
          },
        ];
      },
    },
  ];

  // 编辑
  const handleEdit = (row, type) => {
    const { subjectTaskRelationId, name, taskPrizeParamObjects } = row;
    setVisible({
      show: true,
      type,
      detail: {
        subjectTaskRelationId,
        name,
        coins: taskPrizeParamObjects[0].value,
      },
    });
  };

  // 任务完成配置
  const handleTaskOkConfig = (type) => {
    setVisible({
      show: true,
      type,
      detail: {
        subjectId: tabKey,
        kadou: 111,
        jinbi: 222,
      },
    });
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
        firstFetch={false}
        btnExtra={extraBtn}
        pagination={false}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        rowKey={(record) => `${record.subjectTaskRelationId}`}
        dispatchType="marketConfigure/fetchListSubjectTask"
        params={{ subjectId: tabKey }}
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
  loading: loading.effects['marketConfigure/fetchListSubjectTask'],
}))(TaskConfig);
