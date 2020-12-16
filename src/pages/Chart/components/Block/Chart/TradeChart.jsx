import React from 'react';
import { connect } from 'dva';
import { Donut } from '@/components/Charts';
import { Card, Typography, Row, Col } from 'antd';

/**
 * 入驻店铺行业分布
 */
const TradeChart = ({ searchData, totalData, loading }) => {
  const data = [
    {
      type: '商户家主',
      value: 38,
    },
    {
      type: '用户家主',
      value: 52,
    },
  ];

  const chartProps = {
    height: 330,
    legend: {
      position: 'bottom',
      offsetY: 10,
    },
    innerRadius: 0.75,
    labelColor: 'black',
    statisticShow: false,
    label: {
      type: 'spider',
      formatter: (datum, item) => {
        return `${item._origin.type}\n\n${Math.round((datum / 90) * 100 * 100) / 100}% ${datum}家`;
      },
    },
  };

  return (
    <Card
      bordered={false}
      loading={loading}
      style={{ marginTop: 20, width: '100%' }}
      bodyStyle={{ paddingBottom: loading ? 24 : 0 }}
    >
      <Typography.Title level={5}>入驻店铺行业分布</Typography.Title>
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Donut
            data={data}
            {...chartProps}
            // angleField="count"
            // colorField="categoryName"
          />
        </Col>
        <Col span={12}>
          <Donut
            data={data}
            {...chartProps}
            // angleField="count"
            // colorField="categoryName"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['chartBlock/fetchChartBlockOrder'],
}))(TradeChart);
