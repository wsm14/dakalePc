import React from 'react';
import { connect } from 'umi';
import { SUBSIDY_TYPE, SUBSIDY_ROLE } from '@/common/constant';
import DataTableBlock from '@/components/DataTableBlock';
import HandleSetTable from '@/components/HandleSetTable';

const ActionList = (props) => {
  const { subsidyManage, loading, childRef, setVisible, dispatch } = props;

  // table 表头
  const getColumns = [
    {
      title: '序号',
      fixed: 'left',
      dataIndex: 'rechargeBeans',
      render: (val, row, index) => index + 1,
    },
    {
      title: '行业',
      fixed: 'left',
      dataIndex: 'taskName',
    },
    {
      title: '补贴角色',
      align: 'center',
      dataIndex: 'type',
      render: (val) => SUBSIDY_ROLE[val],
    },
    {
      title: '补贴类型',
      align: 'center',
      dataIndex: 'role',
      render: (val) => SUBSIDY_TYPE[val],
    },
    {
      title: '补贴卡豆数',
      align: 'right',
      dataIndex: 'participants',
    },
    {
      title: '备注',
      align: 'right',
      dataIndex: 'subsidizedBeans',
      render: (val) => val || '--',
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
                type: 'del',
                auth: 'actionDel',
                click: () => fetchSubsidyEndDel({ subsidyId, deleteFlag: 0 }),
              },
              {
                type: 'edit',
                auth: 'actionEdit',
                click: () =>
                  setVisible({ type: 'edit', tab: 'action', show: true, detail: record }),
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

  return (
    <DataTableBlock
      CardNone={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.subsidyId}`}
      dispatchType="subsidyManage/fetchGetList"
      {...subsidyManage.list}
    ></DataTableBlock>
  );
};

export default connect(({ subsidyManage, loading }) => ({
  subsidyManage,
  loading: loading.models.subsidyManage,
}))(ActionList);
