import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const MarketCardActivitySet = (props) => {
  const { dispatch, childRef, visible = false, onClose } = props;
  const [form] = Form.useForm();

  // 新增活动
  const fetchMarketActivityAdd = () => {
    form.validateFields().then((values) => {
      const {
        activityBeginTime: time,
        activityBanner: { fileList },
      } = values;
      const payload = {
        ...values,
        activityBeginTime: time[0].format('YYYY-MM-DD 00:00:00'),
        activityEndTime: time[1].format('YYYY-MM-DD 00:00:00'),
      };
      aliOssUpload(fileList.map((item) => item.originFileObj)).then((res) => {
        dispatch({
          type: 'marketCardActivity/fetchMarketActivityAdd',
          payload: { ...payload, activityBanner: res.toString() },
          callback: () => {
            onClose();
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: '活动名称',
      name: 'activityName',
      maxLength: 20,
    },
    {
      label: '活动时间',
      type: 'rangePicker',
      name: 'activityBeginTime',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: 'banner图',
      type: 'upload',
      name: 'activityBanner',
      maxFile: 1,
    },
    {
      label: '活动链接',
      name: 'activityUrl',
      extra: '跳转进入的H5活动页面链接',
      addRules: [
        {
          type: 'url',
          message: '请输入正确链接格式',
        },
      ],
    },
    {
      type: 'textArea',
      label: '活动简述',
      name: 'description',
      maxLength: 20,
    },
    {
      label: '活动类型',
      name: 'activitySubType',
      maxLength: 20,
    },
  ];

  const modalProps = {
    title: `新增活动`,
    visible,
    onClose,
    afterCallBack:()=>{form.resetFields()},
    footer: (
      <Button type="primary" onClick={() => fetchMarketActivityAdd()}>
        确定
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
      ></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ marketCardActivity, loading }) => ({
  marketCardActivity,
  loading,
}))(MarketCardActivitySet);
