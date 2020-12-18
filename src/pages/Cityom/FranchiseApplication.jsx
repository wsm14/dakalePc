import React, { useRef } from 'react';
import { connect } from 'umi';
import { FRANCHISE_APP_STATUS } from '@/common/constant';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const FranchiseApplication = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();

  // 搜索参数
  const searchItems = [
    {
      label: '手机号',
      name: 'mobile',
    },
    {
      label: '姓名',
      name: 'username',
    },
    {
      label: '申请状态',
      name: 'handled',
      type: 'select',
      select: { list: FRANCHISE_APP_STATUS },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '编号',
      dataIndex: 'userApplyIdString',
      fixed: 'left',
    },
    {
      title: '姓名',
      align: 'center',
      fixed: 'left',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'phoneNumber',
    },
    {
      title: '意向代理城市',
      align: 'center',
      dataIndex: 'intentionalProxyCity',
    },
    {
      title: '目前从事行业',
      align: 'right',
      dataIndex: 'engageIndustry',
    },
    {
      title: '申请时间',
      align: 'right',
      dataIndex: 'createTime',
    },
    {
      title: '申请状态',
      align: 'right',
      dataIndex: 'handled',
      render: (val) => FRANCHISE_APP_STATUS[val],
    },
    {
      title: '处理时间',
      align: 'right',
      dataIndex: 'handleTime',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '操作',
      dataIndex: 'companyName',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '处理',
              visible: record.handled === '0',
              pop: true,
              popText: '加盟申请是否已处理？',
              click: () => fetchFranchiseHandle(record.userApplyIdString),
            },
          ]}
        />
      ),
    },
  ];

  // 获取公司详情
  const fetchFranchiseHandle = (userApplyId) => {
    dispatch({
      type: 'franchiseApp/fetchFranchiseHandle',
      payload: { userApplyId },
      callback: childRef.current.fetchGetData,
    });
  };

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userApplyIdString}`}
      dispatchType="franchiseApp/fetchGetList"
      {...list}
    ></DataTableBlock>
  );
};

export default connect(({ franchiseApp, loading }) => ({
  list: franchiseApp.list,
  loading: loading.effects['franchiseApp/fetchGetList'],
}))(FranchiseApplication);
