import React, { useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form, message } from 'antd';
import { Map, Marker } from 'react-amap';
import { AMAP_KEY } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import BusinessAddBeas from './Edit/BusinessEditBeas';
import BusinessAddQuality from './Edit/BusinessEditQuality';

const BusinessAdd = (props) => {
  const {
    dispatch,
    visible,
    dataSource,
    setDataSource,
    initialValues = false,
    onClose,
    loading,
  } = props;

  const { lnt = 116.407526, lat = 39.90403 } = initialValues;

  const [form] = Form.useForm();
  const [location, setLocation] = useState([lnt, lat]); // [经度, 纬度]
  const [selectCity, setSelectCity] = useState([]); // 选择城市

  // 提交
  const fetchFormData = (auditInfo = {}) => {
    form.validateFields().then((values) => {
      const {
        categoryName: cobj,
        bondBean: bobj,
        coverImg,
        interiorImg,
        otherBrand,
        businessLicenseObject: { businessLicenseImg: bimg },
      } = values;
      if (typeof bimg !== 'string') {
        message.warn('请重新上传营业执照', 1.5);
        return;
      }
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
        ...auditInfo,
      };
      aliOssUpload(coverImg).then((cres) => {
        payload.coverImg = cres.toString();
        aliOssUpload(interiorImg).then((res) => {
          dispatch({
            type: 'businessList/fetchMerchantAdd',
            payload: {
              ...payload,
              interiorImg: res.toString(),
            },
            callback: () => {
              dataSource.map((cValue) => {
                if (cValue.merchantName === values.merchantName) cValue.status = true;
              });
              onClose();
            },
          });
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
    let cityname = '';
    if (typeof city[1] !== 'object') city = selectCity;
    (typeof city[1] === 'object' ? city : selectCity).map((item) => {
      cityname += item.label;
      return true;
    });
    fetch(
      `https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&citylimit=true&city=${
        city[1].label
      }&keywords=${cityname + address}`,
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
              setAmpShow(true);
              setSelectCity(typeof city[1] === 'object' ? city : selectCity);
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
    title: `${initialValues ? '审核' : '新增'}商户`,
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
      <BusinessAddBeas
        form={form}
        amap={amap}
        onSearchAddress={onSearchAddress}
        initialValues={initialValues}
      />
      <BusinessAddQuality form={form} initialValues={initialValues} />
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.businessList,
}))(BusinessAdd);
