import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Bar } from '@/components/Charts';
import { Skeleton, Typography } from 'antd';

const VisitChart = ({ dispatch, searchData, totalData, loading }) => {
  useEffect(() => {
    fetchGetTotalData(searchData);
  }, [searchData]);

  // 获取统计数据
  const fetchGetTotalData = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockOrder',
      payload,
    });
  };

  const data = [
    {
      type: '陌拜次数',
      value: 38,
    },
    {
      type: '回访次数',
      value: 52,
    },
    {
      type: '陪访次数',
      value: 61,
    },
  ];

  return (
    <Skeleton loading={loading} active>
      <Typography.Title level={5}>拜访情况</Typography.Title>
      <Bar
        data={data}
        height={205}
        meta={{ type: { alias: '月份' }, value: { alias: '卡豆数（个）' } }}
        xyField={{ xField: 'value', yField: 'type' }}
      />
    </Skeleton>
  );
};

export default connect(({ chartBlock, loading }) => ({
  totalData: chartBlock.orderInfo,
  loading: loading.effects['chartBlock/fetchChartBlockOrder'],
}))(VisitChart);
