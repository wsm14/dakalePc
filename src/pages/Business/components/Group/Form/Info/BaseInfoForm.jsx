import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { message, Button } from 'antd';
import { AMAP_KEY } from '@/common/constant';
import { Map, Marker } from 'react-amap';
import { checkCityName } from '@/utils/utils';
import QuestionTooltip from '@/components/QuestionTooltip';
import FormCondition from '@/components/FormCondition';

const BaseInfoForm = (props) => {
  const { tradeList, dispatch, formType, form, initialValues } = props;

  const { handle = 'add' } = initialValues; // 获取crm 认领标识 认领 crm 创建 add

  const [map, setMap] = useState(false);
  const [location, setLocation] = useState([120, 30]); // 地图回显用 [经度 lnt , 纬度 lat]

  useEffect(() => {
    // 认领进入时获取一次费率
    if (handle === 'crm') fetchRateByCategory(initialValues.topCategoryId);
  }, [initialValues.topCategoryId]);

  // 获取费率
  const fetchRateByCategory = (categoryId) => {
    if (!categoryId) return;
    dispatch({
      type: 'groupSet/fetchRateByCategory',
      payload: { categoryId },
      callback: (res) => form.setFieldsValue(res),
    });
  };

  const onSearchAddress = () => {
    const address = form.getFieldValue('address');
    const allCityCode = form.getFieldValue('allCode') || [];
    if (!address || !allCityCode.length) {
      message.info('请选择省市区并输入地址');
      return;
    }
    if (address && initialValues.lat && initialValues.lnt) {
      setMap(true);
      setLocation([initialValues.lnt, initialValues.lat]);
      return;
    }
    const city = checkCityName(allCityCode[1]).replace(/-/g, '');
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
              const longitude = parseFloat(geocodes[0]); // 经度 lnt
              const latitude = parseFloat(geocodes[1]); // 纬度 lat
              setLocation([longitude, latitude]);
              setMap(true);
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
      title: '01 基础信息',
      label: '集团名称',
      name: 'groupName',
      disabled: handle === 'crm',
    },
    {
      label: '集团ID',
      name: 'sellMerchantGroupId',
      visible: handle === 'crm' || formType === 'edit',
      disabled: true,
    },
    {
      label: '经营类目',
      type: 'cascader',
      name: 'topCategSelect',
      disabled: formType === 'edit',
      select: tradeList?.filter((i) => i.categoryDTOList),
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      onChange: (val, option) => {
        form.setFieldsValue({
          topCategoryId: val[0],
          topCategoryName: option[0].categoryName,
          categoryId: val[1],
          categoryName: option[1].categoryName,
        });
        fetchRateByCategory(val[0]);
      },
    },
    {
      label: '一级经营类目id',
      name: 'topCategoryId',
      hidden: true,
    },
    {
      label: '一级经营类目名称',
      name: 'topCategoryName',
      hidden: true,
    },
    {
      label: '二级经营类目id',
      name: 'categoryId',
      hidden: true,
    },
    {
      label: '二级经营类目名称',
      name: 'categoryName',
      hidden: true,
    },
    {
      label: '省市区',
      type: 'cascader',
      name: 'allCode',
      disabled: handle === 'crm', // crm认领时候不允许修改省市区
    },
    {
      label: '详细地址',
      name: 'address',
      addonAfter: <a onClick={onSearchAddress}>查询</a>,
    },
    {
      type: 'noForm',
      visible: map,
      formItem: amap,
    },
    {
      label: '经度',
      name: 'lnt',
      hidden: true,
    },
    {
      label: '纬度',
      name: 'lat',
      hidden: true,
    },
    {
      label: '扫码付比例（%）',
      type: 'number',
      min: 0,
      precision: 0,
      name: 'scanCommissionRatio',
      disabled: true,
    },
    {
      label: (
        <QuestionTooltip
          title="商品核销（%）"
          content={'指特惠商品、抵扣券等线上购买业务创建商品/券所需要扣减的服务费'}
        ></QuestionTooltip>
      ),
      type: 'number',
      min: 0,
      precision: 0,
      name: 'commissionRatio',
      placeholder: '请输入商品核销（%）',
      disabled: true,
      rules: [{ required: true, message: '请输入商品核销费' }],
    },
    {
      label: (
        <QuestionTooltip
          title="推广费（%）"
          content={'推广费指发布广告视频精准投放时平台所收取的费用'}
        ></QuestionTooltip>
      ),
      type: 'number',
      min: 0,
      precision: 0,
      placeholder: '请输入推广费（%）',
      name: 'promotionFee',
      rules: [{ required: true, message: '请输入推广费' }],
      disabled: true,
    },
  ];

  return <FormCondition formItems={formItems} form={form} />;
};

export default connect(({ sysTradeList }) => ({
  tradeList: sysTradeList.list.list,
}))(BaseInfoForm);
