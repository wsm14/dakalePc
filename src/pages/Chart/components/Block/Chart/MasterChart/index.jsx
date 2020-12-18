import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
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
  return (
    <Card
      bordered={false}
      loading={loading}
      style={{ marginTop: 20, width: '100%' }}
      bodyStyle={{ paddingBottom: loading ? 24 : 0, maxHeight: 402 }}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: 20 }}>
          {/* 圈层情况 */}
          <MasterChart searchData={searchData}></MasterChart>
        </div>
        <div style={{ flex: 1 }}>
          {/* 圈层推荐情况 */}
          <MasterRecommendChart searchData={searchData}></MasterRecommendChart>
        </div>
      </div>
    </Card>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['chartBlock/fetchChartMasterData'],
}))(MasterChartIndex);
