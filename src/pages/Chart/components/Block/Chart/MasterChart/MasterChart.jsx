import React from 'react';
import { connect } from 'umi';
import { Pie } from '@/components/Charts';
import { Typography, Row, Col, Empty } from 'antd';

/**
 * 圈层情况
 */
const MasterChart = ({ masterDountLeftData, masterDountRightData }) => {

  const dountProps = {
    innerRadius: 0.7,
    angleField: 'count',
    colorField: 'type',
    legend: { position: 'bottom', offsetY: 0 },
    height: 350,
  };

  return (
    <>
      <Typography.Title level={5}>圈层情况</Typography.Title>
      <Row align="middle" style={{ marginBottom: 16 }}>
        <Col span={12}>
          {masterDountLeftData.length ? (
            <Pie data={masterDountLeftData} title="新增家主数" {...dountProps} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
        <Col span={12}>
          {masterDountRightData.length ? (
            <Pie data={masterDountRightData} title="家主收益卡豆" {...dountProps} />
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
