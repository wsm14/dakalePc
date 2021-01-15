import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { SUBSIDY_TYPE, SUBSIDY_ROLE } from '@/common/constant';
import exportExcel from '@/utils/exportExcel';
import AuthConsumer from '@/layouts/AuthConsumer';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';
import SubsidyDrawer from './components/subsidy/SubsidyDrawer';

const SubsidyManage = (props) => {
  const { subsidyManage, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(false);

  // 时间选择器限制选择参数比较
  const [dates, setDates] = useState([]);
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
      select: SUBSIDY_ROLE,
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
      title: '序号',
      fixed: 'left',
      dataIndex: 'rechargeBeans',
      render: (val, row, index) => index + 1,
    },
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
      render: (val) => SUBSIDY_ROLE[val],
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
                click: () => fetchShareDetail(val, record.contentType),
              },
              {
                type: 'del',
                visible: status === '0',
                click: () => fetchSubsidyEndDel({ subsidyId, deleteFlag: 0 }),
              },
              {
                type: 'end',
                pop: true,
                visible: status === '1',
                click: () => fetchSubsidyEndDel({ subsidyId, status: 0 }),
              },
            ]}
          />
        );
      },
    },
  ];

  // 补贴管理 结束 删除
  const fetchSubsidyEndDel = (payload) => {
    dispatch({
      type: 'subsidyManage/fetchSubsidyEndDel',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  // 导出excel 数据
  const fetchGetExcel = (payload) => {
    const header = getColumns.slice(0, -1);
    dispatch({
      type: 'subsidyManage/fetchSubsidyGetExcel',
      payload,
      callback: (data) => exportExcel({ header, data }),
    });
  };

  return (
    <>
      <DataTableBlock
        btnExtra={({ get }) => (
          <>
            <AuthConsumer auth="exportList">
              <Button className="dkl_green_btn" onClick={() => fetchGetExcel(get())}>
                导出
              </Button>
            </AuthConsumer>
            <AuthConsumer auth="save">
              <Button
                className="dkl_green_btn"
                onClick={() => setVisible({ type: 'add', show: true })}
              >
                新增
              </Button>
            </AuthConsumer>
          </>
        )}
        cRef={childRef}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.subsidyId}`}
        dispatchType="subsidyManage/fetchGetList"
        {...subsidyManage.list}
      ></DataTableBlock>
      <SubsidyDrawer visible={visible} setVisible={setVisible}></SubsidyDrawer>
    </>
  );
};

export default connect(({ subsidyManage, loading }) => ({
  subsidyManage,
  loading: loading.models.subsidyManage,
}))(SubsidyManage);
