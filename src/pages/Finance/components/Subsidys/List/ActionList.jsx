import React, { useEffect } from 'react';
import { connect } from 'umi';
import { SUBSIDY_ACTION_TYPE, SUBSIDY_ACTION_ROLE } from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import HandleSetTable from '@/components/TableDataBlock/HandleSetTable';

const ActionList = (props) => {
  const {
    subsidyManage,
    loading,
    childRef,
    setVisible,
    setActionIdList,
    tradeList,
    dispatch,
  } = props;

  useEffect(() => {
    fetchTradeList();
  }, []);

  // 获取行业选择项
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  // 搜索参数
  const searchItems = [
    {
      label: '行业',
      type: 'select',
      name: 'categoryId',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString' },
    },
    {
      label: '补贴角色',
      name: 'subsidyRole',
      type: 'select',
      select: SUBSIDY_ACTION_ROLE,
    },
    {
      label: '补贴类型',
      name: 'subsidyType',
      type: 'select',
      select: SUBSIDY_ACTION_TYPE,
    },
  ];

  // table 表头
  const getColumns = [
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
      order
      noCard={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowSelection={{
        onChange: (val) => setActionIdList(val),
      }}
      rowKey={(record) => `${record.configBehaviorId}`}
      dispatchType="subsidyManage/fetchSubsidyActionList"
      {...subsidyManage.actionList}
    ></TableDataBlock>
  );
};

export default connect(({ subsidyManage, sysTradeList, loading }) => ({
  subsidyManage,
  tradeList: sysTradeList.list.list,
  loading: loading.models.subsidyManage,
}))(ActionList);
