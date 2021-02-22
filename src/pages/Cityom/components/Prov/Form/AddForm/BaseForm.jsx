import React, { useState } from 'react';
import { message, Button } from 'antd';
import { AMAP_KEY } from '@/common/constant';
import { Map, Marker } from 'react-amap';
import CITYJSON from '@/common/city';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const BaseForm = (props) => {
  const { form, detail = {}, type } = props;

  const [map, setMap] = useState(false);
  // 地图上显示的 [经度, 纬度]
  const [location, setLocation] = useState([120, 30]);

  // 搜索地址经纬度
  const onSearchAddress = () => {
    form.validateFields(['address', 'allCityCode', 'allCityName', 'lat', 'lnt']).then((values) => {
      const { address, allCityName, lat, lnt } = values;
      const city = allCityName[1];
      // 当经纬度存在 且地址原值与现在输入框值相同的情况下地图显示当前储存的经纬度
      if (lat && lnt && detail.address == address) {
        setLocation([lnt, lat]);
        setMap(true);
        return;
      }
      fetch(
        `https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&city=${city}&keywords=${
          city + address
        }`,
      )
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              const list = data.pois;
              if (list.length === 0) message.warn('未查询到地址信息', 1.5);
              else {
                const geocodes = list[0].location.split(',');
                const longitude = parseFloat(geocodes[0]); // 经度
                const latitude = parseFloat(geocodes[1]); // 纬度
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
      const latitude = parseFloat(lnglat.lat); // 维度
      const longitude = parseFloat(lnglat.lng); // 经度
      setLocation([longitude, latitude]);
    },
  };

  const amap = (
    <div key="map" style={{ height: 240, marginBottom: 24, position: 'relative' }}>
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
      <Button
        onClick={() => {
          form.setFieldsValue({ lnt: location[0], lat: location[1] });
          message.success('保存新地址成功', 1.5);
          setMap(false);
        }}
        style={{ position: 'absolute', top: 20, right: 20 }}
      >
        确定
      </Button>
    </div>
  );

  const formItems = [
    {
      title: '基础信息',
      label: '企业名称',
      name: 'companyName',
      maxLength: 30,
    },
    {
      label: '分管省份',
      type: 'select',
      name: 'agentProvinceCode',
      select: CITYJSON.map((item) => ({ name: item.label, value: item.value })),
      onChange: (val, item) => form.setFieldsValue({ agentProvinceName: item.children[0] }),
      render: (val, row) => row.agentProvinceName,
    },
    {
      label: '分管省份名字值',
      name: 'agentProvinceName',
      hidden: true,
    },
    {
      label: '企业所在地',
      type: 'cascader',
      name: 'allCityCode',
      onChange: (val) => {
        form.setFieldsValue({ allCityName: val.map((item) => item.label) });
      },
      show: false,
    },
    {
      label: '企业所在地名字',
      name: 'allCityName',
      hidden: true,
    },
    {
      label: '企业地址',
      name: 'address',
      addonAfter: <a onClick={onSearchAddress}>查询</a>,
      render: (val, row) => `${row.allCityName}${val}`,
    },
    {
      type: 'noForm',
      visible: map,
      show: false,
      childrenOwn: amap,
    },
    {
      label: '加盟日期',
      type: 'dataPicker',
      name: 'entryDate',
      render: (val) => val.format('YYYY-MM-DD'),
    },
    {
      label: '签约金额',
      name: 'contractAmount',
      suffix: '元',
      addRules: [{ pattern: NUM_PATTERN, message: '签约金额为大于0的整数' }],
      render: (val) => val + '元',
    },
    {
      label: '经度',
      name: 'lat',
      hidden: true,
      rules: [{ required: false }],
    },
    {
      label: '纬度',
      name: 'lnt',
      hidden: true,
      rules: [{ required: false }],
    },
  ];

  return (
    <>
      {type != 'detail' ? (
        <FormCondition formItems={formItems} form={form} initialValues={detail} />
      ) : (
        <DescriptionsCondition
          title="基础信息"
          formItems={formItems}
          initialValues={detail}
        ></DescriptionsCondition>
      )}
    </>
  );
};

export default BaseForm;
