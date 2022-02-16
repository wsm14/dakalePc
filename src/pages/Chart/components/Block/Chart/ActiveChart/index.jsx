import React from 'react';
import SaleChart from './SaleChart';
import BusinessChart from './BusinessChart';
// import BusinessTotal from './BusinessTotal';
import RankingTotal from '../RankingTotal';
import { Row, Col } from 'antd';

const ActiveChart = ({ searchData, timeData }) => {
  const coloffLeft = { xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 };
  const coloffset = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 };

  return (
    <Row gutter={[20]} style={{ marginTop: 20 }}>
      {/* 销售情况 && 拜访情况 */}
      {/* <Col {...coloffLeft}>
        <SaleChart></SaleChart>
      </Col> */}
      <Col {...coloffLeft}>
        {/* 店铺情况（截止昨日）*/}
        <BusinessChart></BusinessChart>
        {/* 店铺视频统计 */}
        {/* <BusinessTotal></BusinessTotal> */}
      </Col>
      <Col {...coloffLeft}>
        {/* 店铺营收排行 & 销售排行 */}
        <RankingTotal searchData={searchData} timeData={timeData}></RankingTotal>
      </Col>
    </Row>
  );
};

export default ActiveChart;
