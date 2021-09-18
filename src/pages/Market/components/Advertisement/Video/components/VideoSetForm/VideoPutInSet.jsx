import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, message } from 'antd';
import {
  AMAP_KEY,
  VIDEO_ADVERT_PLACE,
  SHARE_AREA_TYPE,
  SHARE_TASTE_TYPE,
  SHARE_SEX_TYPE,
  SHARE_AGE_TYPE,
} from '@/common/constant';
import { Map, Circle, Marker } from 'react-amap';
import { checkCityName } from '@/utils/utils';
import { CitySet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';

/**
 * 投放设置
 */
const VideoPutInSet = (props) => {
  const { form, dispatch, propertyJSON = {}, tasteTag, detail = {} } = props;
  // 默认选择项
  const inputData = {
    gender: 'ALL',
    browseType: 'ALL',
    areaType: 'all',
    taste: 'all',
    age: '0-100',
  };

  const [map, setMap] = useState(false);
  const [location, setLocation] = useState([120, 30]); // 地图回显用 [经度 lnt , 纬度 lat]
  const [areaType, setAreaType] = useState('all'); // 地域选择
  const [radius, setRadius] = useState(0); // 地域选择 - 半径
  const [ageType, setAgeType] = useState('0-100'); // 年龄
  const [tasteType, setTastetype] = useState('all'); // 兴趣选择

  useEffect(() => {
    fetchGetPropertyJSON();
    fetchGetTasteTag();
    setAreaType(detail.areaType);
    setAgeType(detail.age);
    setTastetype(detail.taste);
  }, []);

  // 获取配置文件
  const fetchGetPropertyJSON = () => {
    dispatch({
      type: 'baseData/fetchGetPropertyJSON',
    });
  };

  // 获取兴趣标签
  const fetchGetTasteTag = () => {
    dispatch({
      type: 'baseData/fetchGetTasteTag',
    });
  };

  const onSearchAddress = () => {
    form.validateFields(['beanAddress']).then(({ beanAddress }) => {
      const address = beanAddress;
      const cityName = checkCityName(form.getFieldValue('districtCode'));
      fetch(
        `https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&city=${cityName}&keywords=${
          cityName + address
        }`,
      )
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              const list = data.pois;
              if (list.length === 0) message.warn('未查询到地址信息', 1.5);
              else {
                const geocodes = list[0].location.split(',');
                const longitude = parseFloat(geocodes[0]); // 经度 lnt
                const latitude = parseFloat(geocodes[1]); // 纬度 lat
                form.setFieldsValue({ beanLnt: longitude, beanLat: latitude });
                setLocation([longitude, latitude]);
                setMap(true);
              }
            });
          }
        })
        .finally(() => {});
    });
  };

  // 地图浮标移动定位
  const handleMarkerEvents = {
    dragend: (event) => {
      const { lnglat } = event;
      const longitude = parseFloat(lnglat.lng); // 经度
      const latitude = parseFloat(lnglat.lat); // 维度
      setLocation([longitude, latitude]);
    },
  };

  const amap = (
    <div style={{ height: 240, marginBottom: 24, position: 'relative' }}>
      <Map
        amapkey={AMAP_KEY}
        zoom={19}
        center={location}
        doubleClickZoom={false}
        keyboardEnable={false}
        touchZoom={false}
      >
        <Circle
          center={location} // 坐标
          radius={Number(radius)} // 半径
          style={{ strokeOpacity: 0.2, fillOpacity: 0.4, fillColor: '#1791fc', zIndex: 50 }} // 圈样式
        >
          <Marker clickable draggable position={location} events={handleMarkerEvents} />
        </Circle>
      </Map>
      <Button
        onClick={() => {
          form.setFieldsValue({ beanLnt: location[0], beanLat: location[1] });
          message.success('保存新地址成功', 1.5);
        }}
        style={{ position: 'absolute', top: 20, right: 20 }}
      >
        确定
      </Button>
    </div>
  );

  const formItems = [
    {
      label: '推荐位置',
      name: 'browseType',
      type: 'radio',
      select: VIDEO_ADVERT_PLACE,
    },
    {
      label: '性别',
      name: 'gender',
      type: 'radio',
      select: SHARE_SEX_TYPE,
    },
    {
      label: '年龄',
      name: 'age',
      type: 'radio',
      select: SHARE_AGE_TYPE,
      onChange: (e) => setAgeType(e.target.value),
    },
    {
      label: '年龄段',
      name: 'ageData',
      type: 'checkbox',
      visible: ageType === 'age',
      select: propertyJSON['momentAge'],
      fieldNames: { label: 'description' },
    },
    {
      label: '地域',
      name: 'areaType',
      type: 'radio',
      select: SHARE_AREA_TYPE,
      onChange: (e) => {
        form.setFieldsValue({ cityList: [[]] });
        setAreaType(e.target.value);
      },
    },
    {
      label: '选择城市',
      type: 'formItem',
      visible: ['city', 'district'].includes(areaType),
      formItem: (
        <CitySet
          name="cityList"
          form={form}
          maxLength={50}
          areaType={areaType}
          changeOnSelect={false}
        ></CitySet>
      ),
    },
    {
      label: '附近区域',
      name: 'area',
      type: 'radio',
      visible: areaType === 'near',
      select: propertyJSON['nearDistance'],
      fieldNames: { label: 'description' },
      onChange: (e) => setRadius(e.target.value),
    },
    {
      label: '选择地址',
      visible: areaType === 'near',
      name: 'beanAddress',
      addonAfter: <a onClick={onSearchAddress}>查询</a>,
    },
    {
      type: 'noForm',
      visible: map && areaType === 'near',
      formItem: amap,
    },
    {
      label: '经度',
      name: 'beanLnt',
      visible: areaType === 'near',
      hidden: true,
    },
    {
      label: '纬度',
      name: 'beanLat',
      visible: areaType === 'near',
      hidden: true,
    },
    {
      label: '兴趣',
      name: 'taste',
      type: 'radio',
      select: SHARE_TASTE_TYPE,
      onChange: (e) => setTastetype(e.target.value),
    },
    {
      label: '选择兴趣',
      type: 'tags',
      name: 'tagsId',
      multiple: true,
      visible: tasteType === 'tag',
      select: tasteTag,
      fieldNames: {
        label: 'domainName',
        value: 'domainId',
      },
    },
  ];

  return (
    <FormCondition
      form={form}
      formItems={formItems}
      initialValues={{ ...inputData, ...detail }}
    ></FormCondition>
  );
};

export default connect(({ baseData, businessList, loading }) => ({
  tasteTag: baseData.tasteTag,
  propertyJSON: baseData.propertyJSON,
  selectList: businessList.selectList,
  loading: loading.models.businessList,
}))(VideoPutInSet);
