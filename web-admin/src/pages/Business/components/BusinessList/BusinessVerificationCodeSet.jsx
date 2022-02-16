import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import { PHONE_PATTERN } from '@/common/regExp';

const BusinessVerificationCodeSet = (props) => {
  const { dispatch, visible = false, onClose } = props;
  const [form] = Form.useForm();

  // 新增
  const fetchMerBrandAdd = () => {
    form.validateFields().then((values) => {
      console.log(3333);
      dispatch({
        type: 'businessList/fetchMerVerificationCodeSet',
        payload: values,
        callback: (val) => {
          console.log(val, '222');
          onClose();
          form.resetFields();
        },
      });
    });
  };

  const formItems = [
    {
      label: '商家手机号',
      name: 'mobile',
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
    {
      label: '验证码',
      name: 'smsCode',
      extra: '验证码为四位数字',
      addRules: [{ pattern: new RegExp(/^\d{4}$/), message: '验证码为四位数字' }],
    },
  ];

  const modalProps = {
    title: '设置商家验证码',
    visible,
    onClose,
    footer: (
      <Button type="primary" onClick={fetchMerBrandAdd}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ businessList, loading }) => ({
  businessList,
  loading,
}))(BusinessVerificationCodeSet);
