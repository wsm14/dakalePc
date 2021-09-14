import React, { useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { NUM_INT } from '@/common/regExp';
import { Button, Form, message } from 'antd';
import {
  AMAP_KEY,
  SHARE_AREA_TYPE,
  SHARE_TASTE_TYPE,
  SHARE_SEX_TYPE,
  SHARE_AGE_TYPE,
  NEW_SHARETIME_TYPE,
} from '@/common/constant';
import { Map, Circle, Marker } from 'react-amap';
import { CitySet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const RewardCreate = (props) => {
  const {
    dispatch,
    visible,
    propertyJSON = {},
    params,
    childRef,
    cityName,
    onClose,
    tasteTag,
    loading,
    loadingJSON,
  } = props;

  // 默认选择项
  const inputData = { scope: 'all', areaType: 'all', taste: 'all', gender: 'ALL', age: '0-100' };

  const [form] = Form.useForm();

  const [map, setMap] = useState(false);
  const [location, setLocation] = useState([120, 30]); // 地图回显用 [经度 lnt , 纬度 lat]
  const [areaType, setAreaType] = useState('all'); // 地域选择
  const [radius, setRadius] = useState(0); // 地域选择 - 半径
  const [ageType, setAgeType] = useState('0-100'); // 年龄
  const [tasteType, setTastetype] = useState('all'); // 兴趣选择
  const [timeSelect, setTimeSelect] = useState(false); // 投放时长
  const [totalBean, setTotalBean] = useState({ pnum: 0, bnum: 0 }); // 计算总卡豆

  // 确认发布
  const handleVideoPush = () => {
    form.validateFields().then((values) => {
      const {
        rewardStartTime: time,
        age,
        ageData,
        areaType,
        area,
        cityList = [],
        taste,
        tagsId = [],
        ...ohter
      } = values;
      dispatch({
        type: 'videoPlatform/fetchNewShareRewardSave',
        payload: {
          ...params,
          ...ohter,
          scope: 'all',
          age: age === 'age' ? ageData.toString() : age,
          areaType,
          tagsId: tagsId.toString(),
          area: {
            all: undefined,
            city: cityList.map((i) => i.city[i.city.length - 1]).toString(),
            district: cityList.map((i) => i.city[i.city.length - 1]).toString(),
            near: area,
          }[areaType],
          beginDate: time && time[0].format('YYYY-MM-DD'),
          endDate: time && time[1].format('YYYY-MM-DD'),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

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
      title: '画像设置',
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
      type: 'treeSelect',
      name: 'tagsId',
      multiple: true,
      visible: tasteType === 'tag',
      select: tasteTag.map(({ domainId, domainName, domainDTOList }) => ({
        domainId,
        domainName,
        domainDTOList,
        disabled: true,
      })),
      fieldNames: {
        label: 'domainName',
        value: 'domainId',
        children: 'domainDTOList',
      },
    },
    {
      title: '打赏设置',
      label: '投放时长',
      name: 'tippingTimeType',
      type: 'radio',
      select: NEW_SHARETIME_TYPE,
      onChange: (e) => setTimeSelect(e.target.value),
    },
    {
      label: '时间选择',
      name: 'rewardStartTime',
      type: 'rangePicker',
      visible: timeSelect === 'fixed',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '单次曝光打赏',
      name: 'tippingBean',
      suffix: '卡豆/人',
      addRules: [{ pattern: NUM_INT, message: '应为大于0的整数数字' }],
      onChange: (e) => setTotalBean((old) => ({ ...old, bnum: Number(e.target.value) })),
    },
    {
      label: '目标曝光量',
      name: 'tippingCount',
      suffix: '人',
      addRules: [{ pattern: NUM_INT, message: '应为大于0的整数数字' }],
      onChange: (e) => setTotalBean((old) => ({ ...old, pnum: Number(e.target.value) })),
      extra: `平台补贴总需：${totalBean.pnum * totalBean.bnum}卡豆`,
    },
  ];

  const modalProps = {
    title: '发布分享',
    visible,
    onClose,
    loading: loadingJSON,
    afterCallBack: () => {
      fetchGetPropertyJSON();
      fetchGetTasteTag();
    },
    closeCallBack: () => {
      setMap(false);
      setAgeType('0-100');
      setAreaType('all');
      setTastetype('all');
      setTimeSelect(false);
    },
    footer: (
      <Button type="primary" onClick={handleVideoPush} loading={loading}>
        确认发布
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={inputData}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading, baseData }) => ({
  tasteTag: baseData.tasteTag,
  propertyJSON: baseData.propertyJSON,
  loadingJSON: loading.effects['baseData/fetchGetPropertyJSON'],
  loading: loading.effects['videoPlatform/fetchNewShareRewardSave'],
}))(RewardCreate);
