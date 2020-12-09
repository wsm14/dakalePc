import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const ProvinceTotalComponent = (props) => {
  const { list, loading, dispatch, searchData } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '排名',
      fixed: 'left',
      dataIndex: 'userIdString',
    },
    {
      title: '省份名称',
      fixed: 'left',
      dataIndex: 'mobile',
    },
    {
      title: '营收金额',
      align: 'right',
      dataIndex: 'username',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '核销金额',
      align: 'right',
      dataIndex: 'gender',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '扫码付金额',
      align: 'right',
      dataIndex: 'realNameStatus',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '注册用户数',
      align: 'right',
      dataIndex: 'residentAddress',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '入驻店铺数',
      align: 'right',
      dataIndex: 'createTime',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '激活店铺数',
      align: 'right',
      dataIndex: 'status',
      sorter: (a, b) => a.merchantCount - b.merchantCount,
    },
    {
      title: '操作',
      align: 'right',
      fixed: 'right',
      dataIndex: 'parentUserIdString',
      render: (val, record) => (
        <HandleSetTable
          formItems={[
            {
              type: 'info',
              click: () => fetchUserDetail(record.userIdString),
            },
          ]}
        />
      ),
    },
  ];

  useEffect(() => {
    childRef.current.fetchGetData(searchData);
  }, [searchData]);

  return (
    <DataTableBlock
      NoSearch
      CardNone={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.userIdString}`}
      dispatchType="provCompany/fetchGetList"
    ></DataTableBlock>
  );
};

export default connect(({ provCompany, loading }) => ({
  list: provCompany.list,
  loading: loading.effects['provCompany/fetchGetList'],
}))(ProvinceTotalComponent);
