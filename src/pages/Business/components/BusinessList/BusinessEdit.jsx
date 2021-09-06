import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, message, Modal } from 'antd';
import { Map, Marker } from 'react-amap';
import { AMAP_KEY } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import BusinessAddBeas from './Edit/BusinessEditBeas';
import BusinessAddQuality from './Edit/BusinessEditQuality';
import BusinessEditVoiceInfo from './Edit/BusinessEditVoiceInfo';
import BusinessAuditRefuse from '../Audit/BusinessAuditRefuse';
import BusinessAuditAllow from '../Audit/BusinessAuditAllow';
import DrawerCondition from '@/components/DrawerCondition';

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
  const { type = 'edit', show = false } = visible;
  const { lnt = 116.407526, lat = 39.90403 } = initialValues;

  const [form] = Form.useForm();

  const [location, setLocation] = useState([lnt, lat]); // [经度, 纬度]
  const [selectCity, setSelectCity] = useState([]); // 选择城市
  const [categId, setCategId] = useState(''); // 经营类目
  const [visibleRefuse, setVisibleRefuse] = useState(false); // 审核拒绝

  // 提交
  const fetchFormData = (auditInfo = {}) => {
    form.validateFields().then(async (values) => {
      const {
        categoryName: cobj,
        coverImg,
        headerImg,
        interiorImg,
        logoImg = '',
        otherBrand,
        businessLicenseObject: { businessLicenseImg: bimg },
        businessTime,
        businessHubIdString,
        tags,
        property: { service, speacial },
        scenesIds,
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
        scenesIds: scenesIds.toString(),
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
      const cImg = await aliOssUpload(coverImg);
      const hImg = await aliOssUpload(headerImg);
      const iImg = await aliOssUpload(interiorImg);
      //编辑的时候可以修改店铺logo
      if (type === 'edit') {
        const logos = await aliOssUpload(logoImg);
        payload.logoImg = logos.toString();
      }
      payload.coverImg = cImg.toString();
      payload.headerImg = hImg.toString();
      payload.interiorImg = iImg.toString();
      if (type !== 'audit') {
        payload.headerContentObject = {
          headerType: 'image',
          imageUrl: hImg.toString(),
        };
      }
      dispatch({
        type: {
          edit: 'businessList/fetchMerchantEdit',
          audit: 'businessAudit/fetchMerSaleAuditAllow',
        }[type],
        payload: {
          ...payload,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  // 检查店铺信息是否存在 营业执照号 店铺电话提示 merchantVerifyId（审核时传） userMerchantId merchantName telephone address socialCreditCode
  const fetchMerCheckData = (payload, callback) => {
    dispatch({
      type: 'baseData/fetchMerCheckData',
      payload,
      callback,
    });
  };

  // 新增修改提交 校验
  const fetchUpdataCheck = (values) => {
    const {
      telephone,
      businessLicenseObject: { socialCreditCode },
    } = values;
    // 检查信息是否重复
    fetchMerCheckData(
      {
        userMerchantId: initialValues.userMerchantIdString,
        telephone,
        socialCreditCode,
      },
      (check) => {
        const { businessLicense, telephone } = check;
        if (!businessLicense || !telephone) {
          Modal.confirm({
            title: '提示',
            content: `该店铺已存在${!businessLicense ? '（营业执照号重复）' : ''} ${
              !telephone ? '（店铺电话重复）' : ''
            }，确定要设置吗？`,
            onOk() {
              fetchFormData();
            },
          });
          return;
        }
        fetchFormData();
      },
    );
  };

  // 审核通过
  const fetchAuditAllow = (values) => {
    const {
      telephone,
      businessLicenseObject: { socialCreditCode },
      perCapitaConsumption,
    } = values;
    const info = {
      merchantVerifyId: initialValues.merchantVerifyIdString,
      verifyStatus: 3,
      perCapitaConsumption,
    };
    // 检查信息是否重复
    fetchMerCheckData(
      {
        merchantVerifyId: initialValues.merchantVerifyIdString,
        telephone,
        socialCreditCode,
      },
      (check) => {
        const { businessLicense, telephone } = check;
        let tipContent = '是否确认审核通过？';
        if (!businessLicense || !telephone) {
          tipContent = `该店铺已存在${!businessLicense ? '（营业执照号重复）' : ''} ${
            !telephone ? '（店铺电话重复）' : ''
          }，确定要审核通过吗？`;
        }
        Modal.confirm({
          title: '审核通过',
          content: tipContent,
          onOk() {
            fetchFormData(info);
          },
        });
      },
    );
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
  };

  // 审核驳回
  const fetchAuditRefuse = () => {
    setVisibleRefuse({
      show: true,
      initialValues,
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

  const buttonProps = (callback) => ({
    onClick: () =>
      form.validateFields().then((values) => {
        callback(values);
      }),
    type: 'primary',
    loading,
  });

  const modalProps = {
    title: `${{ audit: '审核', edit: '修改' }[type]}店铺`,
    width: 750,
    visible: show,
    maskClosable: false,
    onClose,
    afterCallBack: () => {
      handleInvalueEdit();
      setCategId(initialValues.topCategoryId);
    },
    footer: (
      <>
        {type == 'edit' && <Button {...buttonProps(fetchUpdataCheck)}>修改</Button>}
        {type == 'audit' && (
          <>
            <Button onClick={fetchAuditRefuse} type="primary" loading={loading}>
              审核驳回
            </Button>
            {initialValues.hasPartner === '1' && (
              <Button {...buttonProps(fetchAuditAllow)}>审核通过</Button>
            )}
          </>
        )}
      </>
    ),
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        <BusinessAddBeas
          form={form}
          amap={amap}
          setType={type}
          categId={categId}
          setCategId={setCategId}
          onSearchAddress={onSearchAddress}
          initialValues={initialValues}
        />
        <BusinessAddQuality form={form} initialValues={initialValues} />
        <BusinessAuditAllow form={form} initialValues={initialValues} categoryId={categId} />
        {type !== 'audit' && <BusinessEditVoiceInfo form={form} initialValues={initialValues} />}
      </DrawerCondition>
      <BusinessAuditRefuse
        visible={visibleRefuse}
        cRef={cRef}
        onClose={() => setVisibleRefuse(false)}
      ></BusinessAuditRefuse>
    </>
  );
};

export default connect(({ loading, businessAudit }) => ({
  businessAudit,
  loading:
    loading.models.businessList ||
    loading.effects['sysTradeList/fetchDetailList'] ||
    loading.models.businessAudit,
}))(BusinessAdd);
