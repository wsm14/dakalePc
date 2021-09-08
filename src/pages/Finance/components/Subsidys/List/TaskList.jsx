import React, { useState } from 'react';
import { connect } from 'umi';
import { SUBSIDY_BEAN_TYPE, SUBSIDY_TASK_ROLE, SUBSIDY_ACTION_ROLE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import TaskDetailList from '../Detail/TaskDetailList';

const TaskManage = (props) => {
  const { subsidyManage, loading, childRef, tabkey, type, setVisible, dispatch } = props;

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
      label: '创建人',
      name: 'creator',
    },
    {
      label: '补贴类型',
      type: 'select',
      name: 'mode',
      select: SUBSIDY_BEAN_TYPE,
    },
    {
      label: '补贴角色',
      type: 'select',
      name: 'role',
      select: tabkey === 'direct' ? SUBSIDY_ACTION_ROLE : SUBSIDY_TASK_ROLE,
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
      title: '角色',
      align: 'center',
      dataIndex: 'role',
      render: (val) => SUBSIDY_ACTION_ROLE[val],
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'mode',
      render: (val) => SUBSIDY_BEAN_TYPE[val],
    },
    {
      title: '总参与店铺/人数',
      align: 'right',
      dataIndex: 'participants',
    },
    {
      title: '补贴/回收卡豆数',
      align: 'right',
      dataIndex: 'totalBeans',
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'createTime',
      render: (val, row) => `${val}\n${row.creator}`,
    },
    {
      type: 'handle',
      dataIndex: 'subsidyId',
      render: (subsidyId, record) => {
        const { status } = record;
        return [
          {
            type: 'info',
            auth: `${tabkey}Info`,
            click: () => fetchSubsidyTaskDetail({ subsidyId }),
          },
          {
            type: `${tabkey}Detail`,
            title: '补贴详情',
            click: () => setTaskDates({ show: true, detail: record }),
          },
          {
            type: 'del',
            auth: `${tabkey}Del`,
            visible: status === '0',
            click: () => fetchSubsidyTaskEndDel({ subsidyId, deleteFlag: 0 }),
          },
          // {
          //   type: 'end',
          //   auth: `${tabkey}End`,
          //   pop: true,
          //   visible: status === '1',
          //   click: () => fetchSubsidyTaskEndDel({ subsidyId, status: 0 }),
          // },
        ];
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

  const btnList = ({ get }) => [
    {
      type: 'excel',
      dispatch: 'subsidyManage/fetchSubsidyTaskGetExcel',
      data: { type, ...get() },
      exportProps: { header: getColumns },
    },
  ];

  return (
    <>
      <TableDataBlock
        order
        noCard={false}
        btnExtra={btnList}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        params={{ type }}
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
