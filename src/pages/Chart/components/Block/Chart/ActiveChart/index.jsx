import React from 'react';
import SaleChart from './SaleChart';
import BusinessChart from './BusinessChart';
// import BusinessTotal from './BusinessTotal';
import { Row, Col } from 'antd';

const ActiveChart = () => {
  const coloffLeft = { xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 };
  const coloffset = { xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 };

  return (
    <Row gutter={[20]} style={{ marginTop: 20 }}>
      {/* 销售情况 && 拜访情况 */}
      <Col {...coloffLeft}>
        <SaleChart></SaleChart>
      </Col>
      <Col {...coloffset}>
        {/* 店铺情况（截止昨日）*/}
        <BusinessChart></BusinessChart>
        {/* 店铺视频统计 */}
        {/* <BusinessTotal></BusinessTotal> */}
      </Col>
    </Row>
  );
};

export default ActiveChart;
