import React from 'react';
import { connect } from 'umi';
import { Button, Card, Form, Input, Typography, Space } from 'antd';

const { Title } = Typography;

const SysPassWord = (props) => {
  const { loading, dispatch } = props;

  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { password, newPassword } = values;
      if (password !== newPassword) {
        form.setFields([
          {
            name: 'password',
            value: password,
            errors: ['两次密码输入不一致'],
          },
          {
            name: 'newPassword',
            value: newPassword,
            errors: ['两次密码输入不一致'],
          },
        ]);
        return;
      }
      dispatch({
        type: 'userInfo/fetchPassWordEdit',
        payload: values,
      });
    });
  };

  return (
    <Card>
      <div style={{ textAlign: 'center' }}>
        <Title level={4} style={{ marginBottom: 20 }}>
          修改密码
        </Title>
      </div>
      <Form
        form={form}
        {...layout}
        name="normal_login"
        style={{ width: 400, margin: '0 auto' }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="旧密码"
          name="oldPassword"
          rules={[{ required: true, message: '请输入旧密码' }]}
        >
          <Input.Password placeholder="请输入旧密码" />
        </Form.Item>
        <Form.Item
          label="新密码"
          name="password"
          rules={[{ required: true, message: '请输入新密码' }]}
        >
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>
        <Form.Item
          label="确认新密码"
          name="newPassword"
          rules={[{ required: true, message: '请确认新密码' }]}
        >
          <Input.Password placeholder="请确认新密码" />
        </Form.Item>
        <Form.Item style={{ paddingLeft: 100 }}>
          <Space>
            <Button onClick={() => form.resetFields()}>重置</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              确定修改
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.userInfo,
}))(SysPassWord);
