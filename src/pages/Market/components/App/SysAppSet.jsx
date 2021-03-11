import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { BANNER_TYPE, BANNER_JUMP_TYPE } from '@/common/constant';
import aliOssUpload from '@/utils/aliOssUpload';
import CitySelect from './CitySelect';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const SysAppSet = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;

  const { show = false, info = '' } = visible;
  const [form] = Form.useForm();
  const [showUrl, setShowUrl] = useState(false); // 链接
  const [showArea, setShowArea] = useState(false); // 区域

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { coverImg, beginDate: time, jumpType, detion, cityData = [] } = values;
      // 城市数据整理
      const newCityList = cityData.map(({ city }) => ({
        provinceCode: city[0],
        cityCode: city[1],
        districtCode: city[2],
      }));
      // 上传图片到oss -> 提交表单
      aliOssUpload(coverImg).then((res) => {
        dispatch({
          type: { true: 'sysAppList/fetchBannerSet', false: 'sysAppList/fetchBannerEdit' }[!info],
          payload: {
            bannerId: info.bannerIdString,
            ...values,
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
    },
    {
      label: '图片上传',
      type: 'upload',
      maxFile: 1,
      name: 'coverImg',
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
      name: 'descrssiption',
      select: ['所有用户可见', '仅哒人可见'],
    },
    {
      label: '应用范围',
      type: 'radio',
      name: 'detion',
      select: ['全平台', '按区县'],
      onChange: (e) => setShowArea(e.target.value === '1'),
    },
    {
      label: '选择区县',
      type: 'formItem',
      visible: showArea,
      formItem: <CitySelect name="cityData" form={form}></CitySelect>,
    },
    {
      type: 'rangePicker',
      label: '展示时间',
      name: 'beginDate',
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
    title: info ? '编辑' : '新增',
    visible: show,
    onClose,
    afterCallback: () => {
      setShowUrl(info.jumpType || false);
      setShowArea(info.detion || false);
    },
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        initialValues={
          info
            ? {
                ...info,
                jumpType: info.jumpType ? info.jumpType : '无',
                beginDate: [
                  moment(info.beginDate, 'YYYY-MM-DD'),
                  moment(info.endDate, 'YYYY-MM-DD'),
                ],
              }
            : {}
        }
        formItems={formItems}
        form={form}
      />
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.sysAppList,
}))(SysAppSet);
