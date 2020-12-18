import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Donut } from '@/components/Charts';
import { Card, Typography, Row, Col, Empty } from 'antd';

/**
 * 入驻店铺行业分布
 */
const TradeChart = ({ dispatch, searchData, tradeLeft, tradeRight, loadingLeft, loadingRight }) => {
  useEffect(() => {
    fetchGetTotalData(searchData);
  }, [searchData]);

  // 获取统计数据
  const fetchGetTotalData = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockTradeLeft',
      payload,
    });
  };

  // 获取统计数据right
  const fetchGetTotalDataRight = (topCategoryId) => {
    dispatch({
      type: 'chartBlock/fetchChartBlockTradeRight',
      payload: {
        ...searchData,
        topCategoryId,
      },
    });
  };

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
        return `${item._origin.categoryName}\n\n${
          Math.round((datum / 90) * 100 * 100) / 100
        }% ${datum}家`;
      },
    },
  };

  return (
    <Card
      bordered={false}
      style={{ marginTop: 20, width: '100%' }}
      bodyStyle={{ paddingBottom: 0 }}
    >
      <Typography.Title level={5}>入驻店铺行业分布</Typography.Title>
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card
            bordered={false}
            loading={loadingLeft}
            bodyStyle={{ paddingBottom: loadingLeft || !tradeLeft.length ? 24 : 0 }}
          >
            {tradeLeft.length ? (
              <Donut
                data={tradeLeft}
                {...chartProps}
                angleField="count"
                colorField="categoryName"
                onClick={(val) => fetchGetTotalDataRight(val.data.categoryId)}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            bordered={false}
            loading={loadingRight || loadingLeft}
            bodyStyle={{ paddingBottom: loadingRight || !tradeRight.length ? 24 : 0 }}
          >
            {tradeRight.length ? (
              <Donut
                data={tradeRight}
                {...chartProps}
                angleField="count"
                colorField="categoryName"
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ chartBlock, loading }) => ({
  tradeLeft: chartBlock.tradeLeft,
  tradeRight: chartBlock.tradeRight,
  loadingLeft: loading.effects['chartBlock/fetchChartBlockTradeLeft'],
  loadingRight: loading.effects['chartBlock/fetchChartBlockTradeRight'],
}))(TradeChart);
