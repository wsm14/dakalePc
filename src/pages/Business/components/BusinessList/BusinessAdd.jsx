import React, { useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form, message } from 'antd';
import { Map, Marker } from 'react-amap';
import { AMAP_KEY } from '@/common/constant';
import BusinessAddBeas from './BusinessAddBeas';
import BusinessAddQuality from './BusinessAddQuality';
import aliOssUpload from '@/utils/aliOssUpload';

const BusinessAdd = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;

  const [form] = Form.useForm();
  const [location, setLocation] = useState([116.407526, 39.90403]); // [经度, 纬度]
  const [selectCity, setSelectCity] = useState([]); // 选择城市

  // 提交
  const fetchFormData = () => {
    form.validateFields().then((values) => {
      const {
        categoryName: cobj,
        bondBean: bobj,
        coverImg: { fileList: cfileList },
        interiorImg: { fileList },
        otherBrand,
      } = values;
      const payload = {
        ...values,
        brandName: otherBrand ? '其他品牌' : values.brandName,
        provinceCode: selectCity[0].value,
        provinceName: selectCity[0].label,
        cityCode: selectCity[1].value,
        cityName: selectCity[1].label,
        districtCode: selectCity[2].value,
        districtName: selectCity[2].label,
        topCategoryId: cobj[0].id,
        topCategoryName: cobj[0].categoryName,
        categoryId: cobj[1].id,
        categoryName: cobj[1].categoryName,
        categoryNode: `${cobj[0].id}.${cobj[1].id}`,
        commissionRatio: bobj.key,
        bondBean: bobj.value,
        lnt: location[0],
        lat: location[1],
      };
      aliOssUpload([
        cfileList[0].originFileObj,
        ...fileList.map((item) => item.originFileObj),
      ]).then((res) => {
        dispatch({
          type: 'businessList/fetchMerchantAdd',
          payload: {
            ...payload,
            coverImg: res[0],
            interiorImg: res.slice(1).toString(),
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  // 获取城市定位
  const onSearchAddress = (address, city, setAmpShow) => {
    if (!address.length) {
      setAmpShow(false);
      return;
    }
    setSelectCity(city);
    let cityname = '';
    city.map((item) => {
      cityname += item.label;
      return true;
    });
    fetch(
      `https://restapi.amap.com/v3/geocode/geo?key=${AMAP_KEY}&city=${city[1].label}&address=${
        cityname + address
      }`,
    )
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            const list = data.geocodes;
            if (list.length === 0) message.warn('未查询到地址信息', 1.5);
            else {
              const geocodes = list[0].location.split(',');
              const longitude = parseFloat(geocodes[0]); // 经度
              const latitude = parseFloat(geocodes[1]); // 纬度
              setLocation([longitude, latitude]);
              setAmpShow(true);
            }
          });
        }
      })
      .finally(() => {});
  };

  const amap = (
    <div style={{ height: 240, marginBottom: 24 }}>
      <Map
        amapkey={AMAP_KEY}
        zoom={19}
        center={location}
        doubleClickZoom={false}
        keyboardEnable={false}
        touchZoom={false}
      >
        <Marker position={location} />
      </Map>
    </div>
  );

  const modalProps = {
    title: `新增商户`,
    width: 600,
    visible,
    maskClosable: false,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={fetchFormData} type="primary" loading={loading}>
              提交审核
            </Button>
          </Space>
        </div>
      }
    >
      <BusinessAddBeas form={form} amap={amap} onSearchAddress={onSearchAddress} />
      <BusinessAddQuality form={form} />
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.businessList,
}))(BusinessAdd);
