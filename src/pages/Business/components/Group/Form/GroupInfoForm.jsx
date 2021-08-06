import React, { useState } from 'react';
import { connect } from 'umi';
import { message, Button } from 'antd';
import { AMAP_KEY } from '@/common/constant';
import { Map, Marker } from 'react-amap';
import { checkCityName } from '@/utils/utils';
import FormCondition from '@/components/FormCondition';

const GroupInfoForm = (props) => {
  const { tradeList, formType, form, initialValues } = props;

  // const { handle = 'add' } = initialValues; // 获取crm 认领标识

  const [map, setMap] = useState(false);
  const [location, setLocation] = useState([120, 30]); // 地图回显用 [经度 lnt , 纬度 lat]

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
      // disabled: handle === 'crm',
    },
    {
      label: '集团ID',
      name: 'sellMerchantGroupId',
      // visible: handle === 'crm',
      disabled: true,
    },
    {
      label: '经营类目',
      type: 'cascader',
      name: 'topCategSelect',
      select: tradeList?.filter((i) => i.categoryDTOList),
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      onChange: (val, option) => {
        form.setFieldsValue({
          topCategoryId: val[0],
          topCategoryName: option[0].categoryName,
          categoryId: val[1],
          categoryName: option[1].categoryName,
        });
      },
    },
    {
      label: '一级经营类目id',
      name: 'topCategoryId',
      hidden: true,
    },
    {
      label: '一级经营类目名称',
      name: 'topCategoryId',
      hidden: true,
    },
    {
      label: '二级经营类目id',
      name: 'topCategoryName',
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
      // disabled: handle === 'crm', // crm认领和编辑时候不允许修改省市区 先记录 不要忘了
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
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ sysTradeList }) => ({
  tradeList: sysTradeList.list.list,
}))(GroupInfoForm);
