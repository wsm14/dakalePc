import React, { useState } from 'react';
import { connect } from 'umi';
import { SUBSIDY_TYPE, SUBSIDY_TASK_ROLE } from '@/common/constant';
import ExcelButton from '@/components/ExcelButton';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/HandleSetTable';
import TaskDetailList from '../Detail/TaskDetailList';

const TaskManage = (props) => {
  const { subsidyManage, loading, childRef, setVisible, dispatch } = props;

  const [dates, setDates] = useState([]); // 时间选择器限制选择参数比较
  const [taskDetail, setTaskDates] = useState(false); // 补贴详情展示

  // 时间限制选择一年
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 365;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 365;
    return tooEarly || tooLate;
  };

  // 搜索参数
  const searchItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '补贴类型',
      type: 'select',
      name: 'type',
      select: SUBSIDY_TYPE,
    },
    {
      label: '补贴角色',
      type: 'select',
      name: 'role',
      select: SUBSIDY_TASK_ROLE,
    },
    {
      label: '时间',
      type: 'rangePicker',
      name: 'startTime',
      end: 'endTime',
      onCalendarChange: setDates,
      onOpenChange: () => setDates([]),
      disabledDate,
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
      title: '补贴类型',
      align: 'center',
      dataIndex: 'type',
      render: (val) => SUBSIDY_TYPE[val],
    },
    {
      title: '补贴角色',
      align: 'center',
      dataIndex: 'role',
      render: (val) => SUBSIDY_TASK_ROLE[val],
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
                auth: 'taskInfo',
                click: () => fetchSubsidyTaskDetail({ subsidyId }),
              },
              {
                type: 'taskDetail',
                click: () => setTaskDates({ show: true, detail: record }),
              },
              {
                type: 'del',
                auth: 'taskDel',
                visible: status === '0',
                click: () => fetchSubsidyTaskEndDel({ subsidyId, deleteFlag: 0 }),
              },
              {
                type: 'end',
                auth: 'taskEnd',
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
            exportProps={{ header: getColumns.slice(0, -1) }}
          ></ExcelButton>
        )}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
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
