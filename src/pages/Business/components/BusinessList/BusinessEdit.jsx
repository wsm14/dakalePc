import React, { useState } from 'react';
import { connect } from 'umi';
import { Drawer, Button, Space, Form, message, Modal, Skeleton } from 'antd';
import { Map, Marker } from 'react-amap';
import { AMAP_KEY } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import BusinessAddBeas from './Edit/BusinessEditBeas';
import BusinessAddQuality from './Edit/BusinessEditQuality';
import businessAuditRefuse from '../Audit/BusinessAuditRefuse';
import BusinessAuditAllow from '../Audit/BusinessAuditAllow';

const BusinessAdd = (props) => {
  const {
    dispatch,
    cRef,
    visible = {},
    initialValues = false,
    onClose,
    loading,
    businessAudit,
  } = props;

  const { type = 'add', show = false } = visible;
  const { lnt = 116.407526, lat = 39.90403 } = initialValues;

  const [form] = Form.useForm();
  // [经度, 纬度]
  const [location, setLocation] = useState([lnt, lat]);
  // 选择城市
  const [selectCity, setSelectCity] = useState([]);
  // 骨架框显示
  const [skeletonType, setSkeletonType] = useState(true);
  // 经营类目
  const [categId, setCategId] = useState('');

  // 提交
  const fetchFormData = (auditInfo = {}) => {
    form.validateFields().then((values) => {
      const {
        categoryName: cobj,
        coverImg,
        interiorImg,
        otherBrand,
        businessLicenseObject: { businessLicenseImg: bimg },
        businessTime,
        businessHubIdString,
        tags,
        property: { service, speacial },
      } = values;
      if (typeof bimg !== 'string') {
        message.warn('请重新上传营业执照', 1.5);
        return;
      }

      const selectTime = values.allTime
        ? '00:00-23:59'
        : Object.values(businessTime)
            .map((item) => {
              if (item) return `${item[0].format('HH:mm')}-${item[1].format('HH:mm')}`;
              else return false;
            })
            .filter((i) => i);

      const { hubList } = businessAudit;
      const businessHubObj = hubList.filter(
        (item) => item.businessHubIdString == businessHubIdString,
      );
      const payload = {
        ...values,
        property: {
          service: service.toString(),
          speacial: speacial ? speacial.toString() : '',
        },
        [type == 'edit' ? 'tag' : 'tags']: tags.toString(),
        userMerchantId: initialValues.userMerchantIdString,
        businessTime: selectTime.toString(), // 营业时间
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
        lnt: location[0],
        lat: location[1],
        ...auditInfo,
      };
      aliOssUpload(coverImg).then((cres) => {
        payload.coverImg = cres.toString();
        aliOssUpload(interiorImg).then((res) => {
          console.log(
            JSON.stringify({
              ...payload,
              interiorImg: res.toString(),
            }),
          );
          dispatch({
            type: {
              add: 'businessList/fetchMerchantAdd',
              edit: 'businessList/fetchMerchantEdit',
              audit: 'businessAudit/fetchMerSaleAuditAllow',
            }[type],
            payload: {
              ...payload,
              interiorImg: res.toString(),
            },
            callback: () => {
              onClose();
              cRef.current.fetchGetData();
            },
          });
        });
      });
    });
  };

  // 审核通过
  const fetchAuditAllow = (values) => {
    Modal.confirm({
      title: '审核通过',
      content: '是否确认审核通过？',
      onOk() {
        // aliOssUpload(allImages).then((res) => {
        const info = {
          merchantVerifyId: initialValues.merchantVerifyIdString,
          verifyStatus: 3,
          perCapitaConsumption: values.perCapitaConsumption,
        };
        fetchFormData(info);
        // });
      },
    });
  };

  // 打开编辑框时默认值赋值
  const handleInvalueEdit = () => {
    if (initialValues) {
      setLocation([lnt, lat]);
      setSelectCity(initialValues.selectCity);
      if (type == 'audit' && initialValues.hasPartner !== '1') {
        Modal.warning({
          title: '提醒',
          content:
            '该商家所在的城市区域未设置城市合伙人，请先设置该城市的城市合伙人，否则无法通过审核',
        });
      }
    }
    setSkeletonType(false);
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
      console.log(event);
      const { lnglat } = event;
      const latitude = parseFloat(lnglat.lat); // 维度
      const longitude = parseFloat(lnglat.lng); // 经度
      setLocation([longitude, latitude]);
    },
  };

  const amap = (
    <div style={{ height: 240, marginBottom: 24 }} key="map">
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

  const modalProps = {
    title: `${{ audit: '审核', add: '新增', edit: '修改' }[type]}商户`,
    width: 750,
    visible: show,
    maskClosable: false,
    destroyOnClose: true,
  };

  const closeDrawer = () => {
    setSkeletonType(true);
    onClose();
  };

  return (
    <Drawer
      {...modalProps}
      onClose={closeDrawer}
      afterVisibleChange={(showEdit) => {
        if (showEdit) {
          setSkeletonType(true);
          handleInvalueEdit();
          setCategId(initialValues.topCategoryId);
        } else {
          setSkeletonType(true);
        }
      }}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={closeDrawer}>取消</Button>
            {type == 'edit' && (
              <Button onClick={() => fetchFormData()} type="primary" loading={loading}>
                修改
              </Button>
            )}
            {type == 'add' && (
              <Button onClick={() => fetchFormData()} type="primary" loading={loading}>
                提交审核
              </Button>
            )}
            {type == 'audit' && (
              <>
                <Button onClick={fetchAuditRefuse} type="primary" loading={loading}>
                  审核驳回
                </Button>
                {initialValues.hasPartner === '1' && (
                  <Button
                    onClick={() => {
                      form.validateFields().then((values) => {
                        fetchAuditAllow(values);
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
      <Skeleton loading={skeletonType} active>
        <BusinessAddBeas
          form={form}
          amap={amap}
          setType={type}
          setCategId={setCategId}
          onSearchAddress={onSearchAddress}
          initialValues={initialValues}
        />
        <BusinessAddQuality form={form} initialValues={initialValues} />
        <BusinessAuditAllow form={form} initialValues={initialValues} categoryId={categId} />
      </Skeleton>
    </Drawer>
  );
};

export default connect(({ loading, businessAudit }) => ({
  businessAudit,
  loading:
    loading.models.businessList ||
    loading.effects['sysTradeList/fetchDetailList'] ||
    loading.models.businessAudit,
}))(BusinessAdd);
