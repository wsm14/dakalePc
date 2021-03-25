import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import {
  BANNER_TYPE,
  BANNER_PORT_TYPE,
  BANNER_JUMP_TYPE,
  BANNER_AREA_TYPE,
  BANNER_LOOK_AREA,
} from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import CitySelect from './CitySelect';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const SysAppSet = (props) => {
  const { dispatch, cRef, visible, onClose, radioType, loading } = props;

  const { show = false, type = 'add', detail = { provinceCityDistrictObjects: [{}] } } = visible;
  const [form] = Form.useForm();
  const [showUrl, setShowUrl] = useState(false); // 链接
  const [showArea, setShowArea] = useState(false); // 区域
  const [showRadio, setShowRadio] = useState(null); // 图片分辨率

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const {
        coverImg,
        beginDate: time,
        jumpType,
        provinceCityDistrictObjects: cityData = [],
      } = values;
      // 城市数据整理
      const provinceCityDistrictObjects = cityData.map(({ city }) => ({
        provinceCode: city[0],
        cityCode: city[1],
        districtCode: city[2],
      }));
      // 上传图片到oss -> 提交表单
      aliOssUpload(coverImg).then((res) => {
        dispatch({
          type: { add: 'sysAppList/fetchBannerSet', edit: 'sysAppList/fetchBannerEdit' }[type],
          payload: {
            bannerId: detail.bannerIdString,
            ...values,
            provinceCityDistrictObjects,
            jumpType: jumpType === '无' ? '' : jumpType,
            coverImg: res.toString(),
            beginDate: time[0].format('YYYY-MM-DD 00:00:00'),
            endDate: time[1].format('YYYY-MM-DD 00:00:00'),
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: '图片位置',
      type: 'select',
      name: 'bannerType',
      select: BANNER_TYPE,
      onChange: setShowRadio,
    },
    {
      label: '图片上传',
      type: 'upload',
      name: 'coverImg',
      visible: showRadio,
      maxFile: 1,
      imgRatio: radioType[showRadio],
    },
    {
      label: '图片说明',
      type: 'textArea',
      name: 'description',
      maxLength: 200,
    },
    {
      label: '可见范围',
      type: 'radio',
      name: 'visibleRange',
      select: BANNER_LOOK_AREA,
    },
    {
      label: '应用范围',
      type: 'radio',
      name: 'deliveryAreaType',
      select: BANNER_AREA_TYPE,
      onChange: (e) => setShowArea(e.target.value === 'detail'),
    },
    {
      label: '选择区县',
      type: 'formItem',
      visible: showArea,
      formItem: <CitySelect name="provinceCityDistrictObjects" form={form}></CitySelect>,
    },
    {
      label: '展示时间',
      name: 'beginDate',
      type: 'rangePicker',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '跳转类型',
      type: 'select',
      name: 'jumpType',
      select: BANNER_JUMP_TYPE,
      onChange: (value) => setShowUrl(value !== '无'),
    },
    {
      label: '跳转链接',
      visible: showUrl,
      name: 'jumpUrl',
    },
  ];

  const modalProps = {
    title: type === 'edit' ? '编辑' : '新增',
    visible: show,
    onClose,
    afterCallBack: () => {
      setShowUrl(detail.jumpType === 'H5');
      setShowArea(detail.deliveryAreaType === 'detail');
    },
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={detail} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ sysAppList, loading }) => ({
  radioType: sysAppList.radioType,
  loading: loading.models.sysAppList,
}))(SysAppSet);
