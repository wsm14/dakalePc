import React, { useEffect } from 'react';
import { Form, Button, Input } from 'antd';
// import QRCode from "qrcode-react";
// import { PHONE_PATTERN } from '@/common/regExp';
import style from './style.less';

const FormItem = Form.Item;

const LoginItem = ({ prop, loading }) => {
  const [form] = Form.useForm();

  // 登录
  const handleSearchsOver = (values) => {
    prop.dispatch({
      type: 'login/login',
      payload: values,
    });
  };

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  return (
    <div className={style.datale_layouts_Context}>
      <div className={style.dakale_contextBox}>
        <div className={style.dakale_contextTitle}>登录系统</div>
        <Form
          form={form}
          layout="vertical"
          className={style.dakale_context_mobile}
          onFinish={handleSearchsOver}
        >
          <FormItem
            label="帐号"
            name="username"
            rules={[
              { required: true, message: '请填写正确帐号' },
              // { pattern: PHONE_PATTERN, message: '请填写正确帐号' },
            ]}
            className={style.dakale_user_form_item}
          >
            <Input placeholder="请输入您的帐号" maxLength="11" />
          </FormItem>
          <FormItem
            label="密码"
            name="password"
            rules={[{ required: true, message: '请填写密码' }]}
            style={{ marginBottom: 0 }}
          >
            <Input.Password placeholder="请输入密码" type="passwprd" />
          </FormItem>
          <Button
            className={style.dakale_Submit}
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            登录
          </Button>
        </Form>
      </div>
    </div>
  );
};
export default LoginItem;
