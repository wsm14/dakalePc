import React, { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import { AMAP_KEY } from '@/common/constant';
import { Map, Marker } from 'react-amap';
import { NUM_PATTERN } from '@/common/regExp';
import CITYJSON from '@/common/city';
import FormCondition from '@/components/FormCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const BaseForm = (props) => {
  const { form, detail = {}, type } = props;

  const [map, setMap] = useState(false);
  // 地图上显示的 [经度, 纬度]
  const [location, setLocation] = useState([120, 30]);
  const [citySelect, setCitySelect] = useState([]);

  useEffect(() => {
    if (detail) setCitySelect(CITYJSON.filter((item) => item.value == detail.provinceCode));
  }, [detail]);

  // 搜索地址经纬度
  const onSearchAddress = () => {
    form.validateFields(['address', 'cityName', 'lat', 'lnt']).then((values) => {
      const { address, cityName, lat, lnt } = values;
      const city = cityName;
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
      label: '所属省公司',
      type: 'select',
      name: 'provinceCode',
      select: CITYJSON,
      fieldNames: { label: 'label' },
      onChange: (val, option) => {
        setCitySelect(CITYJSON.filter((item) => item.value == val));
        form.setFieldsValue({ provinceName: option.children[0] });
      },
      render: (val, row) => row.provinceName,
    },
    {
      label: '所属省公司名字值',
      name: 'provinceName',
      hidden: true,
      show: false,
    },
    {
      label: '企业名称',
      name: 'partnerName',
      maxLength: 30,
    },
    {
      label: '代理区县',
      type: 'cascader',
      name: 'allAgentCityCode',
      select: citySelect,
      onChange: (val, option) => {
        form.setFieldsValue({
          agentProvinceCode: option[0].value,
          agentCityCode: option[1].value,
          agentDistrictCode: option[2].value,
          agentProvinceName: option[0].label,
          agentCityName: option[1].label,
          agentDistrictName: option[2].label,
        });
      },
      render: (val, row) => row.agentProvinceName,
    },
    {
      label: '代理省',
      name: 'agentProvinceCode',
      hidden: true,
      show: false,
    },
    {
      label: '代理市',
      name: 'agentCityCode',
      hidden: true,
      show: false,
    },
    {
      label: '代理区',
      name: 'agentDistrictCode',
      hidden: true,
      show: false,
    },
    {
      label: '代理省名',
      name: 'agentProvinceName',
      hidden: true,
      show: false,
    },
    {
      label: '代理市名',
      name: 'agentCityName',
      hidden: true,
      show: false,
    },
    {
      label: '代理区名',
      name: 'agentDistrictName',
      hidden: true,
      show: false,
    },
    {
      label: '企业所在地',
      type: 'cascader',
      name: 'allCityCode',
      select: citySelect,
      onChange: (val, option) => {
        form.setFieldsValue({
          cityCode: option[1].value,
          cityName: option[1].label,
          districtCode: option[2].value,
          districtName: option[2].label,
        });
      },
      show: false,
    },
    {
      label: '所在市',
      name: 'cityCode',
      hidden: true,
      show: false,
    },
    {
      label: '所在区',
      name: 'districtCode',
      hidden: true,
      show: false,
    },
    {
      label: '所在市名',
      name: 'cityName',
      hidden: true,
      show: false,
    },
    {
      label: '所在区名',
      name: 'districtName',
      hidden: true,
      show: false,
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
      formItem: amap,
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
      show: false,
      rules: [{ required: false }],
    },
    {
      label: '纬度',
      name: 'lnt',
      hidden: true,
      show: false,
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
