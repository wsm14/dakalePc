import React, { useEffect, useContext } from 'react';
import { connect } from 'dva';
import { Bar } from '@/components/Charts';
import { Card, Typography, Empty } from 'antd';
import { ChartContext } from '../../chartStore';

/**
 * 店铺情况（截止昨日）
 */
const BusinessChart = ({ dispatch, totalData, loading }) => {
  const { cityData } = useContext(ChartContext);
  useEffect(() => {
    fetchGetTotalData(cityData);
  }, [cityData]);

  // 获取统计数据
  const fetchGetTotalData = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockAreaMer',
      payload,
    });
  };

  return (
    <Card
      bordered={false}
      loading={loading}
      bodyStyle={{ paddingBottom: loading ? 24 : 0, minHeight: 487 }}
    >
      <Typography.Title level={5}>店铺情况（截止昨日）</Typography.Title>
      {totalData.length ? (
        <Bar
          data={totalData}
          height={379 + 50}
          meta={{ type: { alias: '类型' }, count: { alias: '数量' } }}
          xyField={{ xField: 'count', yField: 'type' }}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Card>
  );
};

export default connect(({ chartBlock, loading }) => ({
  totalData: chartBlock.areaMer,
  loading: loading.effects['chartBlock/fetchChartBlockAreaMer'],
}))(BusinessChart);
