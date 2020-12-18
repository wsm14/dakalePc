import React from 'react';
import { connect } from 'umi';
import { Donut } from '@/components/Charts';
import { Typography, Row, Col, Empty } from 'antd';

/**
 * 圈层情况
 */
const MasterChart = ({ masterDountLeftData, masterDountRightData }) => {
  const heightChart = 330;

  return (
    <>
      <Typography.Title level={5}>圈层情况</Typography.Title>
      <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
        <Col span={12}>
          {masterDountLeftData.length ? (
            <Donut
              data={masterDountLeftData}
              totalLabel="新增家主数"
              height={heightChart}
              legend={{ position: 'bottom', offsetY: 10 }}
              angleField="count"
              colorField="type"
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
        <Col span={12}>
          {masterDountRightData.length ? (
            <Donut
              data={masterDountRightData}
              totalLabel="收益卡豆"
              height={heightChart}
              legend={{ position: 'bottom', offsetY: 10 }}
              angleField="count"
              colorField="type"
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default connect(({ chartBlock }) => ({
  masterDountLeftData: chartBlock.masterDountLeftData,
  masterDountRightData: chartBlock.masterDountRightData,
}))(MasterChart);
