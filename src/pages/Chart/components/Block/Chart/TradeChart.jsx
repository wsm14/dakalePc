import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Pie } from '@/components/Charts';
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
    legend: {
      position: 'bottom',
    },
    layout: 'horizontal',
    radius: 0.8,
    innerRadius: 0.7,
    label: {
      type: 'outer',
      labelHeight: 30,
      content: '{name}\n {percentage} {value}家 ',
    },
  };

  const styles = {
    height: 300,
  };

  return (
    <Card
      bordered={false}
      style={{ marginTop: 20, width: '100%' }}
      bodyStyle={{ paddingBottom: 0 }}
    >
      <Typography.Title level={5}>入驻店铺行业分布</Typography.Title>
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Card
            bordered={false}
            loading={loadingLeft}
            bodyStyle={{
              padding: '0 0 24px 0',
            }}
          >
            {tradeLeft.length ? (
              <div style={styles}>
                <Pie
                  {...chartProps}
                  data={tradeLeft}
                  angleField="count"
                  colorField="categoryName"
                  onClick={(val) => fetchGetTotalDataRight(val.data.data.categoryId)}
                />
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            bordered={false}
            loading={loadingRight || loadingLeft}
            bodyStyle={{
              padding: '0 0 24px 0',
            }}
          >
            {tradeRight.length ? (
              <div style={styles}>
                <Pie
                  data={tradeRight}
                  {...chartProps}
                  angleField="count"
                  colorField="categoryName"
                />
              </div>
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
