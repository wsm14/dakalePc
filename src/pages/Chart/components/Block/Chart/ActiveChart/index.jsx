import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import SaleChart from './SaleChart';
import VisitChart from './VisitChart';
import BusinessChart from './BusinessChart';
import BusinessTotal from './BusinessTotal';

const ActiveChart = ({ dispatch, searchData, totalData, loading }) => {
  return (
    <div style={{ display: 'flex', width: '100%', marginTop: 20 }}>
      <Card
        bordered={false}
        loading={loading}
        bodyStyle={{ paddingBottom: 0 }}
        style={{ flex: 1, marginRight: 20 }}
      >
        {/* 销售情况 */}
        <SaleChart searchData={searchData}></SaleChart>
        {/* 拜访情况 */}
        <VisitChart searchData={searchData}></VisitChart>
      </Card>
      <div style={{ flex: 1 }}>
        <Card bordered={false} loading={loading} bodyStyle={{ paddingBottom: loading ? 24 : 0 }}>
          {/* 店铺情况（截止昨日）*/}
          <BusinessChart searchData={searchData}></BusinessChart>
        </Card>
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          loading={loading}
          style={{ marginTop: 20 }}
        >
          {/* 店铺视频统计 */}
          <BusinessTotal searchData={searchData}></BusinessTotal>
        </Card>
      </div>
    </div>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['chartBlock/fetchChartBlockOrder'],
}))(ActiveChart);
