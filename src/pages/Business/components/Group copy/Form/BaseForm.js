import React, { useImperativeHandle, useState, useEffect } from 'react';
import { connect } from 'umi';
import { message, Button } from 'antd';
import { AMAP_KEY } from '@/common/constant';
import { Map, Marker } from 'react-amap';
import FormCondition from '@/components/FormCondition';

const BaseForm = (props) => {
  const { tradeList, formType, form, initialValues, cRef, groupDetails } = props;

  const { handle } = initialValues; // 获取crm 认领标识

  const [map, setMap] = useState(false);
  const [location, setLocation] = useState([120, 30]); // [经度, 纬度]
  const [address, setAddress] = useState({
    disable: true,
    city: [],
    latlnt: [],
  }); // [经度, 纬度]
  const [categoryObj, setCategoryObj] = useState({});
  // 设置类目
  const onSearchAddress = () => {
    const addressData = form.getFieldValue('address');
    const city = address.city;
    if (addressData && address.city.length === 0 && initialValues.lat && initialValues.lnt) {
      setLocation([initialValues.lat, initialValues.lnt]);
      setMap(true);
      return;
    } else if (!addressData || address.city.length === 0) {
      message.info('请选择省市区并输入地址');
      return;
    }
    let cityname = '';
    city.map((item) => {
      cityname += item.label;
      return true;
    });
    fetch(
      `https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&city=${city[1].label}&keywords=${
        cityname + addressData
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
              setAddress({
                ...address,
                latlnt: [longitude, latitude],
              });
              setMap(true);
            }
          });
        }
      })
      .finally(() => {});
  };
  useImperativeHandle(cRef, () => ({
    fetchAllData: () => {
      let cityList = address.city;
      let cityObj = {};
      if (cityList.length > 0) {
        cityObj = {
          provinceCode: cityList[0].value,
          provinceName: cityList[0].label,
          cityCode: cityList[1].value,
          cityName: cityList[1].label,
          districtCode: cityList[2].value || '',
          districtName: cityList[2].label || '',
        };
      }
      return {
        ...categoryObj,
        ...cityObj,
        lnt: address.latlnt[0],
        lat: address.latlnt[1],
      };
    },
  }));
  // 地图浮标移动定位
  const handleMarkerEvents = {
    dragend: (event) => {
      const { lnglat } = event;
      const latitude = parseFloat(lnglat.lat); // 维度
      const longitude = parseFloat(lnglat.lng); // 经度
      setLocation([longitude, latitude]);
    },
  };

  useEffect(() => {
    if (initialValues) {
      const { cityName = [], categoryObj: cObj = {}, lat, lnt } = initialValues;
      setCategoryObj(cObj);
      setAddress({ city: cityName, latlnt: [lnt, lat] });
      setLocation([lnt, lat]);
    }
  }, [initialValues]);

  useEffect(() => {
    const { merchantGroupDTO = {} } = groupDetails;
    if (Object.keys(merchantGroupDTO).length > 10) {
      const { lat, lnt } = merchantGroupDTO;
      setLocation([lnt, lat]);
    }
  }, [groupDetails]);

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
        <Marker clickable draggable position={location} events={handleMarkerEvents} />
      </Map>
      <Button
        onClick={() => {
          setAddress({
            ...address,
            disable: true,
            latlnt: location,
          });
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
      label: '集团名称',
      name: 'groupName',
      disabled: handle === 'crm',
    },
    {
      label: '集团ID',
      name: 'sellMerchantGroupId',
      visible: handle === 'crm',
      disabled: true,
    },
    {
      label: '经营类目',
      type: 'cascader',
      name: 'topCategSelect',
      select: tradeList.filter((i) => i.categoryDTOList),
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      onChange: (val, option) => {
        const { categoryDTOList, categoryIdString, categoryName, parentId } = option[0];
        setCategoryObj({
          categoryId: option[1].categoryIdString,
          categoryName: option[1].categoryName,
          topCategoryId: categoryIdString,
          topCategoryName: categoryName,
          categoryNode: categoryIdString + '.' + option[1].categoryIdString,
        });
        // form.setFieldsValue({
        //   categoryName: val,
        //   businessArea: undefined,
        //   commissionRatio: undefined,
        // });
      },
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'allCode',
      visible: Object.keys(groupDetails).length !== 0 ? false : true,
      disabled: handle === 'crm',
      onChange: (val, option) => {
        setAddress({ ...address, disable: false, city: option });
      },
    },
    {
      label: '详细地址',
      name: 'address',
      addonAfter: <a onClick={onSearchAddress}>查询</a>,
      disabled: formType === 'edit',
    },
    {
      type: 'noForm',
      visible: map,
      formItem: amap,
    },
    {
      label: '扫码付服务费（%）',
      type: 'number',
      min: 0,
      precision: 0,
      name: 'scanCommissionRatio',
    },
    {
      label: '核销订单服务费（%）',
      type: 'number',
      min: 0,
      precision: 0,
      name: 'commissionRatio',
    },
    // {
    //   label: '服务费比例',
    //   name: 'commissionRatio',
    //   // type: 'number',
    //   rules: [{ required: false }],
    //   addRules:
    //     Object.keys(groupDetails).length === 0
    //       ? [{ pattern: NUM_PERCENTAGE, message: '请输入1-99内数字' }]
    //       : [],
    //   addonAfter: '%',
    //   disabled: Object.keys(groupDetails).length === 0 ? false : true,
    // },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ sysTradeList, groupSet }) => ({
  tradeList: sysTradeList.list.list,
  ...groupSet,
}))(BaseForm);
