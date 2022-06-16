import React, { useState } from 'react';
import { connect } from 'umi';
import { AMAP_KEY } from '@/common/constant';
import debounce from 'lodash/debounce';
import { Map, Marker } from 'react-amap';
import { Modal, Select, Space, Spin, Empty, message } from 'antd';

const MapSearchModal = (props) => {
  const { visible = false, onOk, onClose } = props;

  const [location, setLocation] = useState([120, 30]); // 地图显示 [经度, 纬度]
  const [fetching, setFetching] = useState(false); // 查找地址等待状态
  const [localList, setLocalList] = useState([]); // 可选地址列表
  const [selectLocal, setSelectLocal] = useState(''); // 已选地址

  // 获取城市定位
  const onSearchAddress = debounce((address = '') => {
    if (!address) return;
    setFetching(true);
    fetch(`https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&keywords=${address}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            // console.log('高德搜索到的data', data);
            const list = data.pois;
            if (list.length === 0) message.warn('未查询到地址信息', 1.5);
            else if (address) {
              // console.log('高德搜索到的list', list);
              setLocalList(list);
            }
          });
        }
      })
      .finally(() => {
        setFetching(false);
      });
  }, 500);

  // 浮标事件
  const handleMarkerEvents = {
    dragend: (event) => {
      const { lnglat } = event;
      const latitude = parseFloat(lnglat.lat); // 维度
      const longitude = parseFloat(lnglat.lng); // 经度
      setLocation([longitude, latitude]);
    },
  };

  return (
    <Modal
      title={`选择地址`}
      width={700}
      visible={visible}
      maskStyle={{ background: 'none' }}
      zIndex={1002}
      destroyOnClose
      afterClose={() => {
        setSelectLocal('');
      }}
      okButtonProps={{
        disabled: !selectLocal,
      }}
      onOk={() => {
        onOk({ address: selectLocal, lnt: location[0], lat: location[1] });
        onClose();
      }}
      onCancel={onClose}
    >
      <div key="map" style={{ height: 350, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            zIndex: 11111,
            left: '50%',
            top: 20,
            marginLeft: -150,
          }}
        >
          <Space>
            <Select
              showSearch
              dropdownMatchSelectWidth={false}
              placeholder="输入搜索"
              notFoundContent={
                fetching ? (
                  <Spin size="small" />
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
                )
              }
              onSearch={onSearchAddress}
              onChange={(val, option) => {
                console.log('onChange的val', val.split('+')[0].split(','));
                console.log('onChange的option', option);
                setLocation(val.split('+')[0].split(','));
                setSelectLocal(option.children[1].props.children);
              }}
              filterOption={false}
              style={{ width: 300 }}
            >
              {localList.map((d, i) => (
                <Select.Option key={i} value={`${d.location}+${i}`}>
                  {i + 1 + '、' + ' ' + d.name}
                  <div>{d.adname + d.address}</div>
                </Select.Option>
              ))}
            </Select>
          </Space>
        </div>
        <Map
          amapkey={AMAP_KEY}
          zoom={19}
          center={location}
          doubleClickZoom={false}
          keyboardEnable={false}
          touchZoom={false}
        >
          <Marker clickable draggable position={location} events={handleMarkerEvents} />
        </Map>
      </div>
    </Modal>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(MapSearchModal);
