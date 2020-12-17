import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Typography, Image } from 'antd';
import { Map, Marker, Circle, Markers } from 'react-amap';
import { PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { AMAP_KEY } from '@/common/constant';
import './style.less';

/**
 * 商圈地图
 */
const TradeAreaMap = ({ dispatch, searchData, mapHub }) => {
  // map实例
  const [mapInstance, setMapInstance] = useState(null);
  // 聚合状态
  const [mapCluster, setMapCluster] = useState(true);

  // 获取区域商圈
  const fetchChartMapHub = (payload = {}) => {
    dispatch({
      type: 'chartBlock/fetchChartMapHub',
      payload,
    });
  };

  // 获取地图四角经纬度
  const getMapBounds = (bounds, type) => {
    console.log('bounds', bounds);
    const NorthEast = bounds.northeast;
    const SouthWest = bounds.southwest;
    const lat = [SouthWest.lat, NorthEast.lat].join('_');
    const lnt = [SouthWest.lng, NorthEast.lng].join('_');
    console.log(lat, lnt);
    if (type == 'created') fetchChartMapHub({ lat, lnt });
  };

  // 图例数组
  const lengendArr = [
    {
      label: '已激活',
      url: '',
      onClick: () => {},
    },
    {
      label: '已入驻',
      url: '',
      onClick: () => {},
    },
  ];

  // 图例
  const MapRightLegend = (
    <div className="chart_amap_Legend_right">
      {lengendArr.map((item) => (
        <div className="amap_Legend_item" key={item.label} onClick={item.onClick}>
          <img src={item.url} className="amap_Legend_img"></img> {item.label}
        </div>
      ))}
    </div>
  );

  // 商家信息
  const MreInfo = (
    <div className="chart_amp_mreInfo">
      <div className="chart_amp_mreInfo_heard">
        <Typography.Title level={4} className="title">
          商圈地图（截止昨日）商圈地图（截止昨日）
        </Typography.Title>
        <div className="chart_amp_mreInfo_item">美食/中餐</div>
        <div className="chart_amp_mreInfo_item">
          <div className="chart_amp_mreInfo_icon">
            <PhoneOutlined />
          </div>
          <div className="chart_amp_mreInfo_text"> (0571)83580902</div>
        </div>
        <div className="chart_amp_mreInfo_item">
          <div className="chart_amp_mreInfo_icon">
            <EnvironmentOutlined />
          </div>
          <div className="chart_amp_mreInfo_text">
            杭州市萧山区建设一路与金鸡路交叉口宝龙城市广场内
          </div>
        </div>
      </div>
      <div className="chart_amp_mreInfo_content">
        <p className="merInfo_sale">关联商拓：王龙</p>
        <p>营业时间：07:30-22:30</p>
        <p>相册</p>
        <div className="mreInfo_img">
          <div className="mreInfo_img_item">
            <Image
              width={102}
              height={102}
              src={'http://www.dongfeng-honda-ur-v.com/images/2020page/m1-1.png'}
              className="descript_img"
            />
          </div>
          <div className="mreInfo_img_item">
            <Image
              width={102}
              height={102}
              src={'http://www.dongfeng-honda-ur-v.com/images/2020page/m1-1.png'}
              className="descript_img"
            />
          </div>
          <div className="mreInfo_img_item">
            <Image
              width={102}
              height={102}
              src={'http://www.dongfeng-honda-ur-v.com/images/2020page/m1-1.png'}
              className="descript_img"
            />
          </div>
          <div className="mreInfo_img_item">
            <Image
              width={102}
              height={102}
              src={'http://www.dongfeng-honda-ur-v.com/images/2020page/m1-1.png'}
              className="descript_img"
            />
          </div>
        </div>
      </div>
    </div>
  );

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
          amapkey={AMAP_KEY}
          zooms={[4, 18]}
          doubleClickZoom={false}
          keyboardEnable={false}
          touchZoom={false}
          events={{
            // 地图初始化事件
            created(map) {
              setMapInstance(map);
              // 获取地图四角经纬度
              getMapBounds(map.getBounds(), 'created');
            },
            // 拖拽地图事件
            dragend() {
              // 获取地图四角经纬度
              getMapBounds(mapInstance.getBounds());
            },
            // 地图缩放事件
            zoomend() {
              // 获取地图四角经纬度
              getMapBounds(mapInstance.getBounds());
              // 缩放级别小于 13 显示聚合点 大于13隐藏聚合点 显示散点
              const zoom = mapInstance.getZoom();
              if (zoom < 13) setMapCluster(true);
              else setMapCluster(false);
            },
          }}
        >
          {MreInfo}
          {/* 图例区域 */}
          {MapRightLegend}
          {mapHub.map((item, i) => (
            <Marker
              clickable
              position={[item.lnt, item.lat]}
              events={{
                created(markerInstance) {
                  markerInstance.setLabel({
                    offset: new AMap.Pixel(0, 20), // 设置文本标注偏移量
                    content: `<div class='chart_amp_markey_info'>${item.businessHubName} ${item.settleCount} / ${item.activeCount}</div>`, // 设置文本标注内容
                    direction: 'top', // 设置文本标注方位
                  });
                },
              }}
            />
          ))}
          {mapHub.map((item, i) => (
            <Circle
              center={[item.lnt, item.lat]}
              radius={item.radius}
              style={{ strokeOpacity: 0.2, fillOpacity: 0.4, fillColor: '#1791fc', zIndex: 50 }}
              events={{
                created() {
                  if (i == item.length) mapInstance.setFitView();
                },
              }}
            ></Circle>
          ))}
          {/* <Markers
            useCluster={mapCluster}
            visible={!mapCluster}
            markers={[
              { position: { longitude: 116.408424, latitude: 39.91502, id: 1 } },
              { position: { longitude: 116.408526, latitude: 39.90504, id: 2 } },
              { position: { longitude: 116.419526, latitude: 39.90504, id: 2 } },
            ]}
            events={{
              click(e, marker) {
                // 通过高德原生提供的 getExtData 方法获取原始数据
                const extData = marker.getExtData();
                console.log(extData);
              },
            }}
          /> */}
        </Map>
      </div>
    </Card>
  );
};

export default connect(({ chartBlock }) => ({
  mapHub: chartBlock.mapHub,
}))(TradeAreaMap);
