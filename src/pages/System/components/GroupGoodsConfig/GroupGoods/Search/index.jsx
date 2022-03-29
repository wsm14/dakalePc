import React from 'react';
import { connect } from 'umi';
import { Button, Form, Input } from 'antd';

const Search = ({ onSearch }) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log(values);
    onSearch(values);
  };
  return (
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
      <Form.Item name="商品名称" rules={[{ required: false }]}>
        <Input placeholder="请输入用户名称" />
      </Form.Item>
      <Form.Item name="商品ID" rules={[{ required: false }]}>
        <Input placeholder="请输入商品Id" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          搜索
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect()(Search);
