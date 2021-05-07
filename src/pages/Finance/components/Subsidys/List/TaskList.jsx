import React, { useState } from 'react';
import { connect } from 'umi';
import { SUBSIDY_TYPE, SUBSIDY_TASK_ROLE } from '@/common/constant';
import ExcelButton from '@/components/ExcelButton';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import TaskDetailList from '../Detail/TaskDetailList';

const TaskManage = (props) => {
  const { subsidyManage, loading, childRef, tabkey, setVisible, dispatch } = props;

  const [taskDetail, setTaskDates] = useState(false); // 补贴详情展示

  // 搜索参数
  const searchItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '创建人',
      type: 'select',
      name: 'type',
      select: SUBSIDY_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '任务名称',
      fixed: 'left',
      dataIndex: 'taskName',
      width: 150,
    },
    {
      title: '角色',
      align: 'center',
      dataIndex: 'role',
      render: (val) => SUBSIDY_TASK_ROLE[val],
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'type',
      render: (val) => SUBSIDY_TYPE[val],
    },
    {
      title: '总参与人数',
      align: 'right',
      dataIndex: 'participants',
    },
    {
      title: '已补贴卡豆数',
      align: 'right',
      dataIndex: 'subsidizedBeans',
    },
    {
      title: '创建时间',
      align: 'right',
      dataIndex: 'subsidizedBeans',
      render: (val) => SUBSIDY_TYPE[val],
    },
    {
      title: '操作',
      dataIndex: 'subsidyId',
      fixed: 'right',
      align: 'right',
      render: (subsidyId, record) => {
        const { status } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'info',
                auth: `${tabkey}Info`,
                click: () => fetchSubsidyTaskDetail({ subsidyId }),
              },
              {
                type: `${tabkey}Detail`,
                click: () => setTaskDates({ show: true, detail: record }),
              },
              {
                type: 'del',
                auth: `${tabkey}Del`,
                visible: status === '0',
                click: () => fetchSubsidyTaskEndDel({ subsidyId, deleteFlag: 0 }),
              },
              {
                type: 'end',
                auth: `${tabkey}End`,
                pop: true,
                visible: status === '1',
                click: () => fetchSubsidyTaskEndDel({ subsidyId, status: 0 }),
              },
            ]}
          />
        );
      },
    },
  ];

  // 补贴管理 详情
  const fetchSubsidyTaskDetail = (payload) => {
    dispatch({
      type: 'subsidyManage/fetchSubsidyTaskDetail',
      payload,
      callback: (detail) => setVisible({ type: 'info', show: true, detail }),
    });
  };

  // 补贴管理 结束 删除
  const fetchSubsidyTaskEndDel = (payload) => {
    dispatch({
      type: 'subsidyManage/fetchSubsidyTaskEndDel',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <>
      <TableDataBlock
        order
        noCard={false}
        btnExtra={({ get }) => (
          <ExcelButton
            dispatchType={'subsidyManage/fetchSubsidyTaskGetExcel'}
            dispatchData={get()}
            exportProps={{ header: getColumns }}
          ></ExcelButton>
        )}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ tabkey }}
        rowKey={(record) => `${record.subsidyId}`}
        dispatchType="subsidyManage/fetchGetTaskList"
        {...subsidyManage.list}
      ></TableDataBlock>
      <TaskDetailList visible={taskDetail} onClose={() => setTaskDates(false)}></TaskDetailList>
    </>
  );
};

export default connect(({ subsidyManage, loading }) => ({
  subsidyManage,
  loading:
    loading.effects['subsidyManage/fetchGetTaskList'] ||
    loading.effects['subsidyManage/fetchSubsidyTaskDetail'] ||
    loading.effects['subsidyManage/fetchSubsidyTaskEndDel'],
}))(TaskManage);
