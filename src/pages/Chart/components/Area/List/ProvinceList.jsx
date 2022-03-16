import React, { useRef, useEffect } from 'react';
import { connect, history } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
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
      render: (val, record) => (record.verificationFee + record.scanOrder).toFixed(2),
      sorter: (a, b) => a.verificationFee + a.scanOrder - (b.verificationFee + b.scanOrder),
    },
    {
      title: '核销金额',
      align: 'right',
      dataIndex: 'verificationFee',
      render: (val, record) => val.toFixed(2),
      sorter: (a, b) => a.verificationFee - b.verificationFee,
    },
    {
      title: '扫码付金额',
      align: 'right',
      dataIndex: 'scanOrder',
      render: (val, record) => val.toFixed(2),
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
      type: 'handle',
      dataIndex: 'parentUserIdString',
      render: (val, record) => [
        {
          type: 'info',
          auth: true,
          click: () => handleHistoryChart(record.bucket),
        },
      ],
    },
  ];

  // 跳转数据统计
  const handleHistoryChart = (bucket) => {
    const { beginDate, endDate } = searchData;
    history.push({
      pathname: '/chart/block',
      query: {
        bucket,
        beginDate,
        endDate,
      },
    });
  };

  useEffect(() => {
    childRef.current.fetchGetData(searchData);
  }, [searchData]);

  return (
    <TableDataBlock
      pagination={false}
      firstFetch={false}
      noCard={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      params={{ bucket: tabkey }}
      rowKey={(record) => `${record.bucket}`}
      dispatchType="areaTotal/fetchGetList"
      pagination={false}
      list={list}
    ></TableDataBlock>
  );
};

export default connect(({ areaTotal, loading }) => ({
  list: areaTotal.list,
  loading: loading.effects['areaTotal/fetchGetList'],
}))(ProvinceTotalComponent);
