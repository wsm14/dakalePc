import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Card, Typography } from 'antd';
import { Map, Marker, Circle } from 'react-amap';
import { AMAP_KEY } from '@/common/constant';

/**
 * 商圈地图
 */
const TradeAreaMap = ({ dispatch, searchData, totalData, loading }) => {
  return (
    <Card
      bodyStyle={{ padding: 0, position: 'relative' }}
      loading={loading}
      bordered={false}
      style={{ marginTop: 20 }}
    >
      <Typography.Title
        level={5}
        style={{ position: 'absolute', top: 0, zIndex: 100, left: 20, top: 20 }}
      >
        商圈地图（截止昨日）
      </Typography.Title>
      <div style={{ height: 600 }} key="map">
        <Map
          amapkey={AMAP_KEY}
          zoom={11}
          center={[116.407526, 39.90403]}
          doubleClickZoom={false}
          keyboardEnable={false}
          touchZoom={false}
        >
          <Marker clickable position={[116.407526, 39.90403]} />
          <Circle
            center={[116.407526, 39.90403]}
            radius={5000}
            // visible={this.state.visible}
            style={{ strokeOpacity: 0.2, fillOpacity: 0.4, fillColor: '#1791fc', zIndex: 50 }}
          />
          <Circle
            center={[115.407526, 39.90403]}
            radius={5000}
            style={{ strokeOpacity: 0.2, fillOpacity: 0.4, fillColor: '#1791fc', zIndex: 50 }}
          />
        </Map>
      </div>
    </Card>
  );
};

export default connect(({ chartBlock, loading }) => ({
  totalData: chartBlock.userInfo,
  loading: loading.effects['chartBlock/fetchChartBlockOrder'],
}))(TradeAreaMap);
