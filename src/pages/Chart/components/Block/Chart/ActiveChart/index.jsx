import React from 'react';
import SaleChart from './SaleChart';
import BusinessChart from './BusinessChart';
import BusinessTotal from './BusinessTotal';

const ActiveChart = () => {
  return (
    <div style={{ display: 'flex', width: '100%', marginTop: 20 }}>
      {/* 销售情况 && 拜访情况 */}
      <SaleChart></SaleChart>
      <div style={{ flex: 1 }}>
        {/* 店铺情况（截止昨日）*/}
        <BusinessChart></BusinessChart>
        {/* 店铺视频统计 */}
        <BusinessTotal></BusinessTotal>
      </div>
    </div>
  );
};

export default ActiveChart;
