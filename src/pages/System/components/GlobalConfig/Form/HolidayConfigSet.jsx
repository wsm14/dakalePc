import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Tabs, Form, Button, Upload } from 'antd';
import { GLOBAL_CONFIG_SHARE } from '@/common/imgRatio';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const HolidayConfigSet = (props) => {
  const { initialValues = {} } = props;
  const [form] = Form.useForm();

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
      name: 'showTimeStart',
      end: 'showTimeEnd',
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
      name: 'icon',
    },
    {
      label: '右下角倒计时',
      type: 'upload',
      maxFile: 1,
      extra: '请上传84*84px的png格式图片',
      name: 'icon',
    },
    {
      label: '右下角倒计时动效',
      type: 'upload',
      extra: '请上传100kb的png格式图片',
      name: 'icon',
      labelCol: { span: 5 },
      style: { flex: 1 },
    },
    {
      title: '底部icon',
      label: '捡豆',
      type: 'upload',
      maxFile: 1,
      extra: '请上传750*360px的png格式图片',
      name: 'icon',
    },
    {
      label: '逛逛',
      type: 'upload',
      maxFile: 1,
      extra: '请上传750*360px的png格式图片',
      name: 'icon',
    },
    {
      label: '订单',
      type: 'upload',
      maxFile: 1,
      extra: '请上传750*360px的png格式图片',
      name: 'icon',
    },
    {
      label: '我的',
      type: 'upload',
      maxFile: 1,
      extra: '请上传750*360px的png格式图片',
      name: 'icon',
    },
    {
      title: '配置文件',
      label: '顶部背景',
      type: 'otherUpload',
      extra: '请上传750*360px的png格式图片',
      name: 'icon',
      labelCol: { span: 4 },
      style: { flex: 1 },
    },
  ];
  const modalProps = {
    title: '编辑',
    visible: true,
    width: 700,
    footer:(
        <Button type='primary'>保存</Button>
    )
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
