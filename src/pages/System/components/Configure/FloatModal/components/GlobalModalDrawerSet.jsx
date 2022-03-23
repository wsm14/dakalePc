import React, { useState, useMemo } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { Form, Button, InputNumber } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';
import { NewNativeFormSet } from '@/components/FormListCondition';
import { FLOAT_IMG } from '@/common/imgRatio';
import aliOssUpload from '@/utils/aliOssUpload';

const GlobalModalDrawerSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef } = props;
  const { show = false, type = 'add', detail = {} } = visible;
  console.log(detail);
  const [form] = Form.useForm();
  //保存
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const { windowImage, ...ohter } = values;
      const { userOs, version, area, cityCode, windowType, configFloatingWindowId } = detail;
      const detailParam = { userOs, version, area, cityCode, windowType, configFloatingWindowId };
      // 上传图片到oss -> 提交表单
      const imgList = await aliOssUpload(windowImage);
      dispatch({
        type: {
          add: 'marketConfigure/fetchFloatingWindowAdd',
          edit: 'marketConfigure/fetchFloatingWindowEdit',
        }[type],
        payload: {
          ...ohter,
          ...detailParam,
          flag: { add: 'addConfig', edit: 'updateConfig' }[type],
          windowImage: imgList.toString(),
          activityBeginTime: ohter.activityBeginTime[0].format('YYYY-MM-DD HH:mm'),
          activityEndTime: ohter.activityBeginTime[1].format('YYYY-MM-DD HH:mm'),
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    visible: show,
    title: '弹窗内容配置',
    onClose,
    zIndex: 1001,
    footer: (
      <Button
        type="primary"
        onClick={handleSave}
        loading={
          loading.effects['marketConfigure/fetchFloatingWindowAdd'] ||
          loading.effects['marketConfigure/fetchFloatingWindowEdit']
        }
      >
        保存
      </Button>
    ),
  };
  const formItems = [
    {
      label: '浮窗名称',
      name: 'name',
      maxLength: '15',
    },
    {
      label: '活动时间',
      type: 'rangePicker',
      name: 'activityBeginTime',
      end: 'activityEndTime',
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      disabledDate: (current) => current && current < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '浮窗图片',
      type: 'upload',
      name: 'windowImage',
      maxFile: 1,
      extra: '请上传165*165px png、jpeg、gif图片',
      imgRatio: FLOAT_IMG,
    },
    {
      type: 'noForm',
      formItem: <NewNativeFormSet form={form} detail={detail}></NewNativeFormSet>,
    },
  ];
  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({ loading }))(GlobalModalDrawerSet);
