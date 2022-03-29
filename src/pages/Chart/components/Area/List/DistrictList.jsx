import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import CITYJSON from '@/common/city';
import TableDataBlock from '@/components/TableDataBlock';

const DistrictListComponent = (props) => {
  const { list, loading, searchData, cityCode } = props;

  const { areaCode } = searchData;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '排名',
      dataIndex: 'userIdString',
      render: (val, row, i) => i + 1,
    },
    {
      title: '区县名称',
      dataIndex: 'bucket',
      render: (val) => {
        const provArr = CITYJSON.filter((i) => i.value == areaCode)[0];
        const cityArr = provArr.children.filter((i) => i.value == cityCode)[0];
        const distrctArr = cityArr ? cityArr.children.filter((i) => i.value == val)[0] : '';
        return distrctArr ? distrctArr.label : '--';
      },
    },
    {
      title: '营收金额',
      align: 'right',
      dataIndex: 'getFee',
      render: (val, record) => (record.verificationFee + record.scanOrder).toFixed(2),
      sorter: (a, b) => a.verificationFee + a.scanOrder - (b.verificationFee + b.scanOrder),
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
  ];

  useEffect(() => {
    childRef.current.fetchGetData({ ...searchData, bucket: 'districtCode', areaCode: cityCode });
  }, [cityCode]);

  return (
    <TableDataBlock
      firstFetch={false}
      noCard={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      params={{ bucket: 'districtCode' }}
      rowKey={(record) => `${record.bucket}`}
      pagination={false}
      dispatchType="areaTotal/fetchGetList"
      list={list}
    ></TableDataBlock>
  );
};

export default connect(({ areaTotal, loading }) => ({
  list: areaTotal.districtList,
  loading: loading.effects['areaTotal/fetchGetList'],
}))(DistrictListComponent);
