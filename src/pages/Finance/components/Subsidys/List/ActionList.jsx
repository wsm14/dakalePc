import React from 'react';
import { connect } from 'umi';
import { SUBSIDY_ACTION_TYPE, SUBSIDY_ACTION_ROLE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
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
      dataIndex: 'category',
    },
    {
      title: '补贴角色',
      align: 'center',
      dataIndex: 'subsidyRole',
      render: (val) => SUBSIDY_ACTION_ROLE[val],
    },
    {
      title: '补贴类型',
      align: 'center',
      dataIndex: 'subsidyType',
      render: (val) => SUBSIDY_ACTION_TYPE[val],
    },
    {
      title: '补贴卡豆数',
      align: 'right',
      dataIndex: 'subsidyBean',
      render: (val) => `${val || 0}卡豆`,
    },
    {
      title: '备注',
      align: 'right',
      dataIndex: 'remark',
      render: (val) => val || '--',
    },
    {
      title: '操作',
      dataIndex: 'configBehaviorId',
      fixed: 'right',
      align: 'right',
      render: (id, record) => {
        const { categoryIdStr: categoryId } = record;
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'del',
                auth: 'actionDel',
                click: () => fetchSubsidyActionDel({ id, deleteFlag: 0 }),
              },
              {
                type: 'edit',
                auth: 'actionEdit',
                click: () =>
                  setVisible({
                    type: 'edit',
                    tab: 'action',
                    show: true,
                    detail: { categoryId, ...record },
                  }),
              },
            ]}
          />
        );
      },
    },
  ];

  // 删除
  const fetchSubsidyActionDel = (payload) => {
    dispatch({
      type: 'subsidyManage/fetchSubsidyActionDel',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <TableDataBlock
      noCard={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.configBehaviorId}`}
      dispatchType="subsidyManage/fetchSubsidyActionList"
      {...subsidyManage.actionList}
    ></TableDataBlock>
  );
};

export default connect(({ subsidyManage, loading }) => ({
  subsidyManage,
  loading: loading.models.subsidyManage,
}))(ActionList);
