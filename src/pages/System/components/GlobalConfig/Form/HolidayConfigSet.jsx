import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Tabs, Form, Button, Upload } from 'antd';
import { LEFT_TOP_ICON, RIGHT_COUNT_DWON, TOP_BGIMG, TABBAR_ICON } from '@/common/imgRatio';
import { checkFileData } from '@/utils/utils';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const HolidayConfigSet = (props) => {
  const { visible, onClose, childRef } = props;
  const { show, type, initialValues = {} } = visible;
  const [form] = Form.useForm();

  console.log(initialValues,"222")

  const disabledDate = (current) => {
    return current && current < moment().endOf('day').subtract(1, 'day');
  };

  const formItems = [
    {
      label: '节日名称',
      name: 'name',
      style: { flex: 0.8 },
      labelCol: { span: 6 },
    },
    {
      label: '展示时间',
      type: 'rangePicker',
      name: 'showTime',
      disabledDate: disabledDate,
      style: { flex: 1 },
      labelCol: { span: 6 },
    },
    {
      title: '捡豆',
      label: '左上角',
      type: 'upload',
      maxFile: 1,
      extra: '请上传140*48px的png格式图片',
      imgRatio: LEFT_TOP_ICON,
      name: ['pickUpBeans', 'upperLeftCorner'],
    },
    {
      label: '右下角倒计时',
      type: 'upload',
      maxFile: 1,
      extra: '请上传84*84px的png格式图片',
      imgRatio: RIGHT_COUNT_DWON,
      name: ['pickUpBeans', 'lowerRightCornerCountdown'],
    },
    {
      label: '右下角倒计时动效',
      type: 'upload',
      extra: '请上传100kb的png格式图片',
      maxSize: 100,
      name: ['pickUpBeans', 'lowerRightCornerCountdownDynamic'],
      labelCol: { span: 5 },
      style: { flex: 1 },
    },
    {
      title: '逛逛',
      label: '顶部背景',
      type: 'upload',
      maxFile: 1,
      extra: '请上传750*360px的png格式图片',
      imgRatio: TOP_BGIMG,
      name: ['wanderAround', 'topBackground'],
      labelCol: { span: 5 },
      style: { flex: 1 },
    },
    {
      title: '底部icon',
      label: '捡豆',
      type: 'upload',
      maxFile: 1,
      extra: '请上传88*88px的png格式图片',
      imgRatio: TABBAR_ICON,
      name: ['bottomIcon', 'pickUpBeans'],
    },
    {
      label: '逛逛',
      type: 'upload',
      maxFile: 1,
      extra: '请上传88*88px的png格式图片',
      imgRatio: TABBAR_ICON,
      name: ['bottomIcon', 'wanderAround'],
    },
    {
      label: '订单',
      type: 'upload',
      maxFile: 1,
      extra: '请上传88*88px的png格式图片',
      imgRatio: TABBAR_ICON,
      name: ['bottomIcon', 'order'],
    },
    {
      label: '我的',
      type: 'upload',
      maxFile: 1,
      extra: '请上传88*88px的png格式图片',
      imgRatio: TABBAR_ICON,
      name: ['bottomIcon', 'main'],
    },
    {
      title: '配置文件',
      label: '顶部背景',
      type: 'otherUpload',
      extra: '请上传动效json文件',
      name: ['pickUpBeans', 'file'],
      labelCol: { span: 4 },
      style: { flex: 1 },
    },
  ];

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log(values, 'sss');
    });
  };

  const modalProps = {
    title: { edit: '编辑', info: '详情', save: '新增' }[type],
    visible: show,
    width: 700,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave}>
        保存
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        labelCol={{ span: 12 }}
        style={{ display: 'flex', flexWrap: 'wrap' }}
        formItems={formItems}
        initialValues={initialValues}
        form={form}
      ></FormCondition>
    </DrawerCondition>
  );
};
export default connect()(HolidayConfigSet);
