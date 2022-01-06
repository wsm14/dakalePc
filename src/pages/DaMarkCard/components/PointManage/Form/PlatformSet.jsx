import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { AMAP_KEY } from '@/common/constant';
import debounce from 'lodash/debounce';
import { Map, Marker } from 'react-amap';
import { Select, Button, Space, Spin, Empty, message } from 'antd';
import {
  MARK_CARD_MAIN_TYPE,
  MARK_CARD_OPEN_STATE,
  MARK_CARD_PARENT_TYPE,
} from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const PlatformSet = (props) => {
  const { form, initialValues } = props;

  const [radioData, setRadioData] = useState({});
  const [ampShow, setAmpShow] = useState(false); // 地图是否显示
  const [location, setLocation] = useState([120, 30]); // 地图显示 [经度, 纬度]
  const [fetching, setFetching] = useState(false); // 查找地址等待状态
  const [localList, setLocalList] = useState([]); // 可选地址列表
  const [selectLocal, setSelectLocal] = useState(''); // 已选地址

  const saveSelectData = (data) => setRadioData({ ...radioData, ...data });

  // 获取城市code
  const handleGetDistrictCode = (lnglat) => {
    fetch(`https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_KEY}&location=${lnglat}`);
  };

  // 获取城市定位
  const onSearchAddress = debounce((address = '') => {
    if (!address) return;
    setFetching(true);
    fetch(`https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&keywords=${address}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            console.log('高德搜索到的data', data);
            const list = data.pois;
            if (list.length === 0) message.warn('未查询到地址信息', 1.5);
            else if (address) {
              console.log('高德搜索到的list', list);
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

  // 地图组件
  const amap = (
    <div key="map" style={{ height: 350, marginBottom: 24, position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          zIndex: 11111,
          width: 400,
          left: '50%',
          top: 20,
          marginLeft: -200,
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
              console.log('onChange的val', val);
              console.log('onChange的option', option);
              setLocation(val.split(','));
              setSelectLocal(option.children[1].props.children);
            }}
            filterOption={false}
            style={{ width: 300 }}
          >
            {localList.map((d, i) => (
              <Select.Option key={i} value={d.location}>
                {i + 1 + '、' + ' ' + d.name}
                <div>{d.adname + d.address}</div>
              </Select.Option>
            ))}
          </Select>
          <Button onClick={() => setAmpShow(false)}>取消</Button>
          <Button
            type="primary"
            onClick={() => {
              if (!selectLocal && location.length === 0) {
                form.validateFields(['address']);
                return;
              }
              form.setFieldsValue({
                address: selectLocal,
                lat: location[1],
                lnt: location[0],
              });
              setAmpShow(false);
            }}
          >
            确定
          </Button>
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
  );

  // 信息
  const formItems = [
    {
      label: '主体名称',
      name: 'name',
    },
    {
      label: '主体类型',
      name: 'hittingMainType',
      type: 'select',
      select: MARK_CARD_MAIN_TYPE,
      rules: [{ required: false }],
    },
    {
      label: '主体说明',
      name: 'remark',
      type: 'textArea',
      maxLength: 50,
      rules: [{ required: false }],
    },
    {
      label: '主体地址',
      name: 'address',
      addonAfter: <a onClick={() => setAmpShow(true)}>选地址</a>,
      placeholder: '请选择商圈地址',
    },
    {
      type: 'noForm',
      visible: ampShow,
      formItem: amap,
    },
    {
      label: '纬度',
      name: 'lat',
      hidden: true,
    },
    {
      label: '经度',
      name: 'lnt',
      hidden: true,
    },
    {
      label: '打卡范围',
      name: 'distanceFlag',
      type: 'radio',
      select: ['不限', '周围米数'],
    },
    {
      label: '打卡范围周围米数',
      name: 'range',
      type: 'number',
      min: 0,
    },
    {
      label: '家主',
      name: 'parentUserType',
      type: 'radio',
      select: MARK_CARD_PARENT_TYPE,
      rules: [{ required: false }],
    },
    {
      label: '启用状态',
      name: 'status',
      type: 'radio',
      select: MARK_CARD_OPEN_STATE,
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </>
  );
};

export default connect(({}) => ({}))(PlatformSet);
