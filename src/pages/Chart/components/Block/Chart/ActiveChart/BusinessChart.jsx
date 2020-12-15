import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Bar } from '@/components/Charts';
import { Typography } from 'antd';

const BusinessChart = ({ dispatch, searchData, totalData }) => {
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
      type: '累计入驻店铺数',
      value: 38,
    },
    {
      type: '累计激活店铺数',
      value: 52,
    },
    {
      type: '近1月活跃店铺数',
      value: 61,
    },
    {
      type: '潜在流失店铺数',
      value: 61,
    },
    {
      type: '已产生订单店铺数',
      value: 61,
    },
    {
      type: '已上架商品店铺数',
      value: 61,
    },
    {
      type: '已发布视频店铺数',
      value: 61,
    },
  ];

  return (
    <>
      <Typography.Title level={5}>店铺情况（截止昨日）</Typography.Title>
      <Bar
        data={data}
        height={379}
        meta={{ type: { alias: '月份' }, value: { alias: '卡豆数（个）' } }}
        xyField={{ xField: 'value', yField: 'type' }}
      />
    </>
  );
};

export default connect(({ chartBlock }) => ({
  totalData: chartBlock.orderInfo,
}))(BusinessChart);
