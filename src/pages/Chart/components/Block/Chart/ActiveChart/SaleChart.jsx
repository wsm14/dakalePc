import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Bar } from '@/components/Charts';
import { Typography } from 'antd';

/**
 * 销售情况
 */
const SaleChart = ({ dispatch, searchData, totalData }) => {
  // useEffect(() => {
  //   fetchGetTotalData(searchData);
  // }, [searchData]);

  // // 获取统计数据
  // const fetchGetTotalData = (payload = {}) => {
  //   dispatch({
  //     type: 'chartBlock/fetchChartBlockOrder',
  //     payload,
  //   });
  // };

  const data = [
    {
      type: '新认领',
      value: 38,
    },
    {
      type: '新注册',
      value: 52,
    },
    {
      type: '新入驻',
      value: 61,
    },
    {
      type: '新激活',
      value: 145,
    },
    {
      type: '新培训',
      value: 48,
    },
  ];

  return (
    <>
      <Typography.Title level={5}>销售情况</Typography.Title>
      <Bar
        data={data}
        height={300}
        meta={{ type: { alias: '月份' }, value: { alias: '卡豆数（个）' } }}
        xyField={{ xField: 'value', yField: 'type' }}
      />
    </>
  );
};

export default connect(({ chartBlock,  }) => ({
  totalData: chartBlock.orderInfo,
}))(SaleChart);
