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
      <Card bordered={false} style={{ flex: 1, marginRight: 20 }}>
        <SaleChart searchData={searchData}></SaleChart>
        <VisitChart searchData={searchData}></VisitChart>
      </Card>
      <div style={{ flex: 1 }}>
        <Card bordered={false}>
          <BusinessChart searchData={searchData}></BusinessChart>
        </Card>
        <BusinessTotal searchData={searchData}></BusinessTotal>
      </div>
    </div>
  );
};

export default connect()(ActiveChart);
