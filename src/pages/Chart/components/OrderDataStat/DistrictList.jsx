import React, { useRef, useEffect } from 'react';
import { connect } from 'umi';
import TableDataBlock from '@/components/TableDataBlock';
import { getCityName } from '@/utils/utils';

const DistrictListComponent = (props) => {
  const { list, loading, searchData, cityCode } = props;

  const childRef = useRef();

  // table 表头
  const getColumns = [
    {
      title: '地区',
      dataIndex: 'districtCode',
      render: (val) => getCityName(val),
    },
    {
      title: '支付金额占比',
      dataIndex: 'moneyPercent',
    },
    {
      title: '支付金额',
      dataIndex: 'payMoneySum',
      render: (val) => `￥${val}`,
    },
  ];

  useEffect(() => {
    childRef.current.fetchGetData({ ...searchData, groupBy: 'district', code: cityCode });
  }, [cityCode]);

  return (
    <TableDataBlock
      firstFetch={false}
      noCard={false}
      cRef={childRef}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.districtCode}`}
      dispatchType="orderDataStat/fetchOrderAreaAnalysisReport"
      list={list}
      total={list.length}
    ></TableDataBlock>
  );
};

export default connect(({ orderDataStat, loading }) => ({
  list: orderDataStat.areaData.districtList,
  loading: loading.effects['orderDataStat/fetchOrderAreaAnalysisReport'],
}))(DistrictListComponent);
