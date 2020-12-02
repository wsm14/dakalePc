import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space, Form, message, Modal } from 'antd';
import { Map, Marker } from 'react-amap';
import { AMAP_KEY } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import BusinessAddBeas from './Edit/BusinessEditBeas';
import BusinessAddQuality from './Edit/BusinessEditQuality';
import businessAuditRefuse from '../Audit/BusinessAuditRefuse';
import BusinessAuditAllow from '../Audit/BusinessAuditAllow';

const BusinessAdd = (props) => {
  const { dispatch, cRef, visible, initialValues = false, onClose, loading, businessAudit } = props;

  const { lnt = 116.407526, lat = 39.90403 } = initialValues;

  const [form] = Form.useForm();
  const [location, setLocation] = useState([lnt, lat]); // [经度, 纬度]
  const [selectCity, setSelectCity] = useState([]); // 选择城市
  const [visibleAllow, setVisibleAllow] = useState(false);
  const [marker, setMarker] = useState(true); // 浮标拖拽状态

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
        businessHubIdString,
      } = values;
      if (typeof bimg !== 'string') {
        message.warn('请重新上传营业执照', 1.5);
        return;
      }
      const { hubList } = businessAudit;
      const businessHubObj = hubList.filter(
        (item) => item.businessHubIdString == businessHubIdString,
      );
      const payload = {
        ...values,
        businessHubId: businessHubObj.length ? businessHubObj[0].businessHubIdString : '',
        businessHub: businessHubObj.length ? businessHubObj[0].businessHubName : '',
        brandName: otherBrand ? '其他品牌' : values.brandName,
        provinceCode: selectCity[0].value,
        provinceName: selectCity[0].label,
        cityCode: selectCity[1].value,
        cityName: selectCity[1].label,
        districtCode: selectCity[2].value,
        districtName: selectCity[2].label,
        topCategoryId: cobj[0].categoryIdString,
        topCategoryName: cobj[0].categoryName,
        categoryId: cobj[1].categoryIdString,
        categoryName: cobj[1].categoryName,
        categoryNode: `${cobj[0].categoryIdString}.${cobj[1].categoryIdString}`,
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
            type: {
              false: 'businessList/fetchMerchantAdd',
              true: 'businessAudit/fetchMerSaleAuditAllow',
            }[!!initialValues],
            payload: {
              ...payload,
              interiorImg: res.toString(),
            },
            callback: () => {
              if (auditInfo.verifyStatus) setVisibleAllow(false);
              onClose();
              cRef.current.fetchGetData();
            },
          });
        });
      });
    });
  };

  // 打开编辑框时默认值赋值
  const handleInvalueEdit = () => {
    if (initialValues) {
      setLocation([lnt, lat]);
      setSelectCity(initialValues.selectCity);
      if (initialValues.hasPartner !== '1') {
        Modal.warning({
          title: '提醒',
          content:
            '该商家所在的城市区域未设置城市合伙人，请先设置该城市的城市合伙人，否则无法通过审核',
        });
      }
    }
  };

  // 审核驳回
  const fetchAuditRefuse = () => {
    dispatch({
      type: 'drawerForm/show',
      payload: businessAuditRefuse({ dispatch, cRef, initialValues, onClose }),
    });
  };

  // 获取城市定位
  const onSearchAddress = (address, city, setAmpShow) => {
    if (!address.length) {
      setAmpShow(false);
      return;
    }
    setMarker(false);
    let cityname = '';
    if (typeof city[1] !== 'object') city = selectCity;
    (typeof city[1] === 'object' ? city : selectCity).map((item) => {
      cityname += item.label;
      return true;
    });
    fetch(
      `https://restapi.amap.com/v3/place/text?key=${AMAP_KEY}&city=${city[1].label}&keywords=${
        cityname + address
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
              console.log(city[1].label, [longitude, latitude]);
              setLocation([longitude, latitude]);
              setAmpShow(true);
              setMarker(true);
              setSelectCity(typeof city[1] === 'object' ? city : selectCity);
            }
          });
        }
      })
      .finally(() => {});
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
    <div style={{ height: 240, marginBottom: 24 }}>
      <Map
        amapkey={AMAP_KEY}
        zoom={19}
        center={location}
        doubleClickZoom={false}
        keyboardEnable={false}
        touchZoom={false}
      >
        <Marker clickable draggable={marker} position={location} events={handleMarkerEvents} />
      </Map>
    </div>
  );

  const modalProps = {
    title: `${initialValues ? '审核' : '新增'}商户`,
    width: 800,
    visible,
    maskClosable: false,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      afterVisibleChange={(showEdit) => {
        if (showEdit) {
          handleInvalueEdit();
        }
      }}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            {!initialValues && (
              <Button onClick={fetchFormData} type="primary" loading={loading}>
                提交审核
              </Button>
            )}
            {initialValues && (
              <>
                <Button onClick={fetchAuditRefuse} type="primary" loading={loading}>
                  审核驳回
                </Button>
                {initialValues.hasPartner === '1' && (
                  <Button
                    onClick={() => {
                      form.validateFields().then((values) => {
                        setVisibleAllow(true);
                      });
                    }}
                    type="primary"
                    loading={loading}
                  >
                    审核通过
                  </Button>
                )}
              </>
            )}
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
      {initialValues && (
        <BusinessAuditAllow
          visible={visibleAllow}
          initialValues={initialValues}
          onClose={() => setVisibleAllow(false)}
          merchantName={initialValues.merchantName}
          merchantVerifyId={initialValues.merchantVerifyIdString}
          fetchFormData={fetchFormData}
          categoryId={form.getFieldValue('topCategoryName')}
        />
      )}
    </Drawer>
  );
};

export default connect(({ loading, businessAudit }) => ({
  businessAudit,
  loading: loading.models.businessList,
}))(BusinessAdd);
