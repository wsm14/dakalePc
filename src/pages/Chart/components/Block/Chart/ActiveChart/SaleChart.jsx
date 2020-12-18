import React, { useEffect, useContext } from 'react';
import { connect } from 'dva';
import { Bar } from '@/components/Charts';
import { Card, Typography } from 'antd';
import { ChartContext } from '../../chartStore';

/**
 * 销售情况 && 拜访情况
 */
const SaleChart = ({ dispatch, totalData, loading }) => {
  const { timeData } = useContext(ChartContext);

  useEffect(() => {
    fetchGetTotalData(timeData);
  }, [timeData]);

  // 获取统计数据
  const fetchGetTotalData = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockSale',
      payload,
    });
  };

  const data = [
    {
      type: '激活店铺',
      value: totalData.activeCount || 0,
    },
    {
      type: '上架店铺',
      value: totalData.onSellCount || 0,
    },
    {
      type: '认领店铺',
      value: totalData.claimCount || 0,
    },
    {
      type: '再分配数',
      value: totalData.assignCount || 0,
    },
    {
      type: '入驻店铺',
      value: totalData.settleCount || 0,
    },
    {
      type: '培训店铺',
      value: totalData.trainCount || 0,
    },
  ];

  const dataVisit = [
    {
      type: '陌拜次数',
      value: totalData.firstVisitTimes || 0,
    },
    {
      type: '回访次数',
      value: totalData.visitTimes || 0,
    },
    {
      type: '陪访次数',
      value: totalData.companyVisitTimes || 0,
    },
  ];

  return (
    <Card
      bordered={false}
      loading={loading}
      bodyStyle={{ paddingBottom: 0 }}
      style={{ flex: 1, marginRight: 20 }}
    >
      <Typography.Title level={5}>销售情况</Typography.Title>
      <Bar
        data={data}
        height={350}
        meta={{ type: { alias: '类型' }, value: { alias: '数量' } }}
        xyField={{ xField: 'value', yField: 'type' }}
      />
      <Typography.Title level={5}>拜访情况</Typography.Title>
      <Bar
        data={dataVisit}
        height={205}
        meta={{ type: { alias: '类型' }, value: { alias: '数量' } }}
        xyField={{ xField: 'value', yField: 'type' }}
      />
    </Card>
  );
};

export default connect(({ chartBlock, loading }) => ({
  totalData: chartBlock.saleLeft,
  loading: loading.effects['chartBlock/fetchChartBlockSale'],
}))(SaleChart);
