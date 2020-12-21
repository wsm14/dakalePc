import React, { useState } from 'react';
import { connect, history } from 'umi';
import { Card, Typography } from 'antd';
import { Map, Marker, Circle, Markers } from 'react-amap';
import { AMAP_JS_KEY } from '@/common/constant';
import MreDetail from './MreDetail';
import MapLegend from './MapLegend';
import dai from './icon/mreji.png';
import ruzhu from './icon/ruzhu.png';
import './style.less';

/**
 * 商圈地图
 */
const TradeAreaMap = ({ dispatch, mapHubDetail, mapHub, mapHubId }) => {
  // map实例
  const [mapInstance, setMapInstance] = useState(null);
  // 商户详情
  const [mreInfoShow, setMreInfoShow] = useState({ show: false, detail: {} });

  // 获取区域商圈
  const fetchChartMapHub = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartMapHub',
      payload,
    });
  };

  // 获取区域商圈 - 散点
  const fetchChartMapHubMre = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartMapHubMre',
      payload: { ...payload, page: 1, limit: 99 },
    });
  };

  // 获取区域商圈 - 商家详情
  const fetchChartMapHubMreDeatil = (merchantId) => {
    dispatch({
      type: 'chartBlock/fetchChartMapHubMreDeatil',
      payload: { merchantId },
      callback: (detail) => setMreInfoShow({ show: true, detail }),
    });
  };

  // 获取地图四角经纬度
  const getMapBounds = (bounds, type) => {
    console.log('bounds', type, bounds);
    const NorthEast = bounds.northeast;
    const SouthWest = bounds.southwest;
    const lat = [SouthWest.lat, NorthEast.lat].join('_');
    const lnt = [SouthWest.lng, NorthEast.lng].join('_');
    // 初始渲染获取商圈
    if (type === 'created') fetchChartMapHub({ lat, lnt });
    // 缩放移动等获取详情
    else if (type === 'detail') {
      fetchChartMapHubMre({ lat, lnt });
    }
  };

  // 删除原本点坐标防止重复渲染 排除商圈坐标点
  const mapRemoveMaekes = () => {
    // 删除原本点坐标防止重复渲染 排除商圈坐标点
    const removeArr = mapInstance
      .getAllOverlays('marker')
      .filter((item) => mapHubId.indexOf(item.getExtData()) === -1);
    // 删除点
    mapInstance.remove(removeArr);
  };

  // 点样式
  const renderMarkerLayout = (extData) => {
    // verifyStatus 3-已入住 bankStatus 3-待激活
    const { verifyStatus, bankStatus } = extData.position;
    const mekes = {
      width: 25,
      height: 25,
    };
    if (bankStatus == 3) {
      return (
        <div
          style={{ ...mekes, backgroundImage: `url(${dai})`, backgroundSize: '100% 100%' }}
        ></div>
      );
    }
    if (verifyStatus == 3) {
      return (
        <div
          style={{ ...mekes, backgroundImage: `url(${ruzhu})`, backgroundSize: '100% 100%' }}
        ></div>
      );
    }
  };

  // map 事件
  const mapEvents = {
    // 地图初始化事件
    created(map) {
      const {
        query: { bucket = '' },
      } = history.location;

      // 保存地图实例
      setMapInstance(map);
      // 获取地图四角经纬度
      getMapBounds(map.getBounds(), 'created');
      // url传递城市的情况下 地图跳转到指定城市界面
      if (bucket && map) {
        if (bucket !== '33') map.setCity(`${bucket}0000`);
      }
    },
    // 拖拽 移动变化地图事件
    moveend() {
      mapRemoveMaekes();
      // 缩放级别小于 14 请求接口显示聚合点 大于14隐藏聚合点 显示散点
      const zoom = mapInstance.getZoom();
      if (zoom >= 14) {
        getMapBounds(mapInstance.getBounds(), 'detail');
      }
    },
  };

  return (
    <Card
      bodyStyle={{ padding: 0, position: 'relative' }}
      bordered={false}
      style={{ marginTop: 20 }}
    >
      <Typography.Title level={5} className="chart_map_title_style">
        商圈地图（截止昨日）
      </Typography.Title>
      <div style={{ height: 700 }} key="map">
        <Map
          plugins={['Scale']} // 工具 MapType 类型切换 OverView 鹰眼 Scale 比例尺 ToolBar 工具条 ControlBar 控件
          amapkey={AMAP_JS_KEY}
          zooms={[4, 20]} // 缩放范围 20以上地图细节不存在
          doubleClickZoom={false}
          keyboardEnable={false}
          touchZoom={false}
          events={mapEvents}
        >
          {/* 商户详情 */}
          {mreInfoShow.show && (
            <MreDetail
              detail={mreInfoShow.detail}
              onClose={() => setMreInfoShow({ show: false, detail: {} })}
            ></MreDetail>
          )}
          {/* 图例区域 */}
          <MapLegend></MapLegend>
          {/* 商圈 */}
          {mapHub.map((item, i) => (
            <Circle
              key={item.businessHubName}
              center={[item.lnt, item.lat]} // 坐标
              radius={item.radius} // 半径
              style={{ strokeOpacity: 0.2, fillOpacity: 0.4, fillColor: '#1791fc', zIndex: 50 }} // 圈样式
              events={{
                created() {
                  // 初始化事件 最后一个商圈渲染后地图自适应显示所有商圈范围
                  if (i == item.length) mapInstance.setFitView();
                },
              }}
            >
              {/* 商圈中心 */}
              <Marker
                clickable
                position={[item.lnt, item.lat]} // 坐标
                extData={item.businessHubIdString} // 额外参数 保存商户id
                events={{
                  created(markerInstance) {
                    markerInstance.setLabel({
                      offset: new AMap.Pixel(0, 15), // 设置文本标注偏移量
                      content: `<div class='chart_amp_markey_info'>${item.businessHubName} <span className='ruzhuColor'>${item.settleCount}</span> / ${item.activeCount}</div>`, // 设置文本标注内容
                      direction: 'top', // 设置文本标注方位
                    });
                  },
                }}
              />
            </Circle>
          ))}
          {/* 聚合点 */}
          <Markers
            markers={mapHubDetail}
            render={renderMarkerLayout}
            events={{
              created(marker) {
                marker.map((item) => {
                  const extData = item.getExtData().position;
                  item.setLabel({
                    offset: new AMap.Pixel(0, 0), // 设置文本标注偏移量
                    content: `<div class='chart_amp_markeys_info'>${extData.merchantName}</div>`, // 设置文本标注内容
                    direction: 'bottom', // 设置文本标注方位
                  });
                });
              },
              click(e, marker) {
                // 通过高德原生提供的 getExtData 方法获取原始数据
                const extData = marker.getExtData().position;
                fetchChartMapHubMreDeatil(extData.userMerchantIdString);
              },
            }}
          />
        </Map>
      </div>
    </Card>
  );
};

export default connect(({ chartBlock }) => ({
  mapHub: chartBlock.mapHub,
  mapHubId: chartBlock.mapHubId,
  mapHubDetail: chartBlock.mapHubDetail,
}))(TradeAreaMap);
