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
const TradeAreaMap = ({ dispatch, mapHubDetail, searchData, mapHub }) => {
  // map实例
  const [mapInstance, setMapInstance] = useState(null);
  // 聚合状态
  const [mapCluster, setMapCluster] = useState(true);
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
      callback: () => setMapCluster(false),
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
    else if (type === 'detail') fetchChartMapHubMre({ lat, lnt });
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
  const {
    merchantName,
    topCategoryName,
    categoryName,
    telephone,
    address,
    salesperson,
    businessTime,
    coverImg,
    allImgs,
  } = mreInfoShow.detail;
  // 商家信息
  const MreInfo = (
    <div className="chart_amp_mreInfo">
      <div className="chart_amp_mreInfo_heard">
        <Typography.Title level={4} className="title">
          {merchantName || '--'}
        </Typography.Title>
        <div className="chart_amp_mreInfo_item">
          {topCategoryName} / {categoryName}
        </div>
        <div className="chart_amp_mreInfo_item">
          <div className="chart_amp_mreInfo_icon">
            <PhoneOutlined />
          </div>
          <div className="chart_amp_mreInfo_text"> {telephone || '--'}</div>
        </div>
        <div className="chart_amp_mreInfo_item">
          <div className="chart_amp_mreInfo_icon">
            <EnvironmentOutlined />
          </div>
          <div className="chart_amp_mreInfo_text">{address || '--'}</div>
        </div>
      </div>
      <div className="chart_amp_mreInfo_content">
        <p className="merInfo_sale">关联商拓：{salesperson || '--'}</p>
        <p>营业时间：{businessTime || '--'}</p>
        <p>相册</p>
        <div className="mreInfo_img">
          <div className="mreInfo_img_item">
            <Image width={102} height={102} src={coverImg} className="descript_img" />
          </div>
          {allImgs
            ? allImgs.split(',').map((item) => (
                <div className="mreInfo_img_item">
                  <Image width={102} height={102} src={item} className="descript_img" />
                </div>
              ))
            : ''}
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
          zooms={[4, 20]}
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
              // 获取地图四角经纬度 detail 获取可视界面商圈
              const zoom = mapInstance.getZoom();
              if (zoom >= 14) {
                getMapBounds(mapInstance.getBounds(), 'detail');
              }
            },
            // 地图缩放事件
            zoomend() {
              // 缩放级别小于 14 请求接口显示聚合点 大于14隐藏聚合点 显示散点
              const zoom = mapInstance.getZoom();
              console.log('zoom', zoom);
              if (zoom >= 14) {
                getMapBounds(mapInstance.getBounds(), 'detail');
              } else {
                console.log(1);
                setMapCluster(true);
              }
            },
          }}
        >
          {/* 商户详情 */}
          {mreInfoShow.show && MreInfo}
          {/* 图例区域 */}
          {MapRightLegend}
          {/* 商圈中心 */}
          {/* 商圈 */}
          {mapHub.map((item, i) => (
            <Circle
              key={item.businessHubName}
              center={[item.lnt, item.lat]}
              radius={item.radius}
              style={{ strokeOpacity: 0.2, fillOpacity: 0.4, fillColor: '#1791fc', zIndex: 50 }}
              events={{
                created() {
                  if (i == item.length) mapInstance.setFitView();
                },
              }}
            >
              {/* 商圈中心 */}
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
            </Circle>
          ))}
          <Markers
            useCluster={mapCluster}
            visible={!mapCluster}
            markers={mapHubDetail}
            events={{
              created(marker) {
                marker.map((item) => {
                  const extData = item.getExtData().position;
                  item.setLabel({
                    offset: new AMap.Pixel(0, 50), // 设置文本标注偏移量
                    content: `<div class='chart_amp_markeys_info'>${extData.merchantName}</div>`, // 设置文本标注内容
                    direction: 'top', // 设置文本标注方位
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
  mapHubDetail: chartBlock.mapHubDetail,
}))(TradeAreaMap);
