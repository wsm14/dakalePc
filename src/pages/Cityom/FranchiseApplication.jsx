import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const FranchiseApplication = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState('');

  // 搜索参数
  const searchItems = [
    {
      label: '手机号',
      name: 'userMosbile1s',
    },
    {
      label: '姓名',
      name: 'userMobile1',
    },
    {
      label: '申请状态',
      name: 'userMo',
      type: 'select',
      select: { list: [] },
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '编号',
      dataIndex: 'userId',
      fixed: 'left',
    },
    {
      title: '姓名',
      align: 'center',
      fixed: 'left',
      dataIndex: 'phoneNumber',
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'orderCount',
    },
    {
      title: '意向代理城市',
      align: 'center',
      dataIndex: 'aa',
    },
    {
      title: '目前从事行业',
      align: 'right',
      dataIndex: 'bb',
    },
    {
      title: '申请时间',
      align: 'right',
      dataIndex: 'addTimeasdStamp',
    },
    {
      title: '申请状态',
      align: 'right',
      dataIndex: 'addsadTimeStamp',
    },
    {
      title: '处理时间',
      align: 'right',
      dataIndex: 'addTsdaimeStamp',
      render: (val) => (val ? val : '--'),
    },
    {
      title: '操作',
      dataIndex: 'id',
      fixed: 'right',
      align: 'right',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'own',
              title: '处理',
              visible: true,
              pop: true,
              popText: '加盟申请是否已处理？',
              click: () => setVisible({ type: 'income', record }),
            },
          ]}
        />
      ),
    },
  ];

  // 获取公司详情
  const fetchProvComDetail = () => {
    dispatch({
      type: 'provCompany/fetchProvComDetail',
      payload: {},
      callback: handleSetActive,
    });
  };

  return (
    <DataTableBlock
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      searchItems={searchItems}
      rowKey={(record) => `${record.userId}`}
      dispatchType="provCompany/fetchGetList"
      {...list}
      list={[{ name: 1 }]}
    ></DataTableBlock>
  );
};

export default connect(({ provCompany, loading }) => ({
  list: provCompany.list,
  loading: loading.effects['provCompany/fetchGetList'],
}))(FranchiseApplication);
