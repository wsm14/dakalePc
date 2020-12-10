import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';
import CITYJSON from '@/common/city';

const ProvinceTotalComponent = (props) => {
  const { list, tabkey, loading, searchData } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '排名',
      fixed: 'left',
      dataIndex: 'userIdString',
      render: (val, row, i) => i + 1,
    },
    {
      title: '省份名称',
      fixed: 'left',
      dataIndex: 'bucket',
      render: (val) =>
        CITYJSON.filter((i) => i.value == val).length
          ? CITYJSON.filter((i) => i.value == val)[0].label
          : '--',
    },
    {
      title: '营收金额',
      align: 'right',
      dataIndex: 'getFee',
      render: (val, record) => record.verificationFee + record.scanOrder,
      sorter: (a, b) => a.verificationFee + a.scanOrder - (b.verificationFee + b.scanOrder),
    },
    {
      title: '核销金额',
      align: 'right',
      dataIndex: 'verificationFee',
      sorter: (a, b) => a.verificationFee - b.verificationFee,
    },
    {
      title: '扫码付金额',
      align: 'right',
      dataIndex: 'scanOrder',
      sorter: (a, b) => a.scanOrder - b.scanOrder,
    },
    {
      title: '注册用户数',
      align: 'right',
      dataIndex: 'registerCount',
      sorter: (a, b) => a.registerCount - b.registerCount,
    },
    {
      title: '入驻店铺数',
      align: 'right',
      dataIndex: 'settleCount',
      sorter: (a, b) => a.settleCount - b.settleCount,
    },
    {
      title: '激活店铺数',
      align: 'right',
      dataIndex: 'activeCount',
      sorter: (a, b) => a.activeCount - b.activeCount,
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
      params={{ bucket: tabkey }}
      rowKey={(record) => `${record.bucket}`}
      dispatchType="areaTotal/fetchGetList"
      list={list}
    ></DataTableBlock>
  );
};

export default connect(({ areaTotal, loading }) => ({
  list: areaTotal.list,
  loading: loading.effects['areaTotal/fetchGetList'],
}))(ProvinceTotalComponent);
