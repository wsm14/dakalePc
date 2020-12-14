import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form } from 'antd';
import { Map, Marker } from 'react-amap';
import { AMAP_KEY } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const BusinessHubSet = (props) => {
  const { dispatch, cRef, visible = { show: false }, onClose, loading, businessAudit } = props;

  const { show: visibleHub = false, info = {} } = visible;

  const [form] = Form.useForm();

  const [hubList, setHubList] = useState([]);
  const [selectCity, setSelectCity] = useState(info.provinceCode || []);
  // const [location, setLocation] = useState([lnt, lat]); // [经度, 纬度]
  // const [marker, setMarker] = useState(true); // 浮标拖拽状态

  // 提交
  const fetchFormData = () => {
    form.validateFields().then((values) => {
      const { businessHubIdString, address } = values;
      const { hubList } = businessAudit;
      const businessHubObj = hubList.filter(
        (item) => item.businessHubIdString == businessHubIdString,
      );
      dispatch({
        type: 'businessList/fetchMerchantEdit',
        payload: {
          address,
          businessHubId: businessHubObj.length ? businessHubObj[0].businessHubIdString : '',
          businessHub: businessHubObj.length ? businessHubObj[0].businessHubName : '',
          merchantId: info.userMerchantIdString,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  // 获取详情
  const fetchGetDetail = (payload) => {
    dispatch({
      type: 'businessAudit/fetchWaitBusinessHub',
      payload,
      callback: (info) => setHubList(info),
    });
  };

  // // 获取城市定位
  // const onSearchAddress = (address, city, setAmpShow) => {
  //   if (!address.length) {
  //     setAmpShow(false);
  //     return;
  //   }
  //   setMarker(false);
  //   let cityname = '';
  //   if (typeof city[1] !== 'object') city = selectCity;
  //   (typeof city[1] === 'object' ? city : selectCity).map((item) => {
  //     cityname += item.label;
  //     return true;
  //   });
  //   fetch(
  //     `https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&city=${city[1].label}&keywords=${
  //       cityname + address
  //     }`,
  //   )
  //     .then((res) => {
  //       if (res.ok) {
  //         res.json().then((data) => {
  //           const list = data.pois;
  //           if (list.length === 0) message.warn('未查询到地址信息', 1.5);
  //           else {
  //             const geocodes = list[0].location.split(',');
  //             const longitude = parseFloat(geocodes[0]); // 经度
  //             const latitude = parseFloat(geocodes[1]); // 纬度
  //             console.log(city[1].label, [longitude, latitude]);
  //             setLocation([longitude, latitude]);
  //             setAmpShow(true);
  //             setMarker(true);
  //             setSelectCity(typeof city[1] === 'object' ? city : selectCity);
  //           }
  //         });
  //       }
  //     })
  //     .finally(() => {});
  // };

  // // 地图浮标移动定位
  // const handleMarkerEvents = {
  //   dragend: (event) => {
  //     const { lnglat } = event;
  //     const latitude = parseFloat(lnglat.lat); // 维度
  //     const longitude = parseFloat(lnglat.lng); // 经度
  //     setLocation([longitude, latitude]);
  //   },
  // };

  // const amap = (
  //   <div style={{ height: 240, marginBottom: 24 }}>
  //     <Map
  //       amapkey={AMAP_KEY}
  //       zoom={19}
  //       center={location}
  //       doubleClickZoom={false}
  //       keyboardEnable={false}
  //       touchZoom={false}
  //     >
  //       <Marker clickable draggable={marker} position={location} events={handleMarkerEvents} />
  //     </Map>
  //   </div>
  // );

  const formItems = [
    {
      label: '省市区',
      type: 'cascader',
      name: 'citycodeArr',
      disabled: true,
      onChange: (val) => {
        fetchGetDetail({ districtCode: val[2].value });
        // setSelectCity(val);
      },
    },
    {
      label: '所属商圈',
      name: 'businessHubIdString',
      type: 'select',
      select: hubList.map((item) => ({
        name: item.businessHubName,
        value: item.businessHubIdString,
      })),
    },
    {
      label: '详细地址',
      name: 'address',
    },
    // {
    //   type: 'noForm',
    //   visible: ampShow,
    //   childrenOwn: amap,
    // },
  ];

  const modalProps = {
    title: `修改商户信息 - ${info.merchantName}`,
    width: 700,
    visible: visibleHub,
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      afterVisibleChange={(vishow) => {
        vishow && fetchGetDetail({ districtCode: info.districtCode });
      }}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={fetchFormData} type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <FormCondition formItems={formItems} initialValues={info} form={form} loading={loading} />
    </Drawer>
  );
};

export default connect(({ loading, businessAudit }) => ({
  businessAudit,
  loading: loading.effects['businessList/fetchMerchantSet'],
}))(BusinessHubSet);
