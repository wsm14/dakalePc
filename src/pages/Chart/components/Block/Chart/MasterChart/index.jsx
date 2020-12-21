import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Card, Row, Col } from 'antd';
import MasterChart from './MasterChart';
import MasterRecommendChart from './MasterRecommendChart';

const MasterChartIndex = ({ dispatch, searchData, loading }) => {
  useEffect(() => {
    fetchGetTotalData(searchData);
  }, [searchData]);

  // 获取统计数据
  const fetchGetTotalData = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartMasterData',
      payload,
    });
  };

  const coloffLeft = { xs: 24, sm: 24, md: 24, lg: 24, xl: 16, xxl: 12 };
  const coloffset = { xs: 24, sm: 24, md: 24, lg: 24, xl: 8, xxl: 12 };

  return (
    <Card
      bordered={false}
      loading={loading}
      style={{ marginTop: 20, width: '100%' }}
      bodyStyle={{ paddingBottom: loading ? 24 : 0 }}
    >
      <Row gutter={[20]}>
        <Col {...coloffLeft}>
          {/* 圈层情况 */}
          <MasterChart searchData={searchData}></MasterChart>
        </Col>
        <Col {...coloffset}>
          {/* 圈层推荐情况 */}
          <MasterRecommendChart searchData={searchData}></MasterRecommendChart>
        </Col>
      </Row>
    </Card>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['chartBlock/fetchChartMasterData'],
}))(MasterChartIndex);
