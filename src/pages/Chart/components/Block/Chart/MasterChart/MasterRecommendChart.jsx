import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Column } from '@/components/Charts';
import { Skeleton, Typography } from 'antd';

/**
 * 圈层推荐情况
 */
const MasterRecommendChart = ({ dispatch, searchData, totalData }) => {
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
      type: '人推人',
      value: 38,
    },
    {
      type: '人推店',
      value: 52,
    },
    {
      type: '店推人',
      value: 61,
    },
    {
      type: '店推店',
      value: 61,
    },
  ];

  return (
    <>
      <Typography.Title level={5}>圈层推荐情况</Typography.Title>
      <Column
        data={data}
        height={346}
        meta={{ type: { alias: '月份' }, value: { alias: '卡豆数（个）' } }}
        xyField={{ xField: 'type', yField: 'value' }}
      />
    </>
  );
};

export default connect(({ chartBlock }) => ({
  totalData: chartBlock.orderInfo,
}))(MasterRecommendChart);
