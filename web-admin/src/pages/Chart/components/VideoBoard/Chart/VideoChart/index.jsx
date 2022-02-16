import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Card, Row, Col } from 'antd';
import MasterChart from './MasterChart';

const MasterChartIndex = ({}) => {
  const coloffLeft = { xs: 24, sm: 24, md: 24, lg: 24, xl: 10, xxl: 10 };
  const styles = { height: '100%' };

  return (
    <Col {...coloffLeft}>
      <Card
        bordered={false}
        // loading={loading}
        style={{ marginTop: 20, width: '100%', height: '480px' }}
        bodyStyle={{ paddingTop: 5 }}
      >
        <MasterChart styles={styles}></MasterChart>
      </Card>
    </Col>
  );
};

export default connect(({ loading }) => ({
  // loading: loading.effects['videoBoard/fetchMomentKanBan'],
}))(MasterChartIndex);
