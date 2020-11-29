import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Form, Button, Space } from 'antd';
import FormComponents from '@/components/FormCondition';

const TradeAreaSet = (props) => {
  const { info = {}, fetchSet, visible, onClose, loading } = props;

  const [form] = Form.useForm();

  // 新增 / 修改
  const handleUpdata = () => {
    form.validateFields().then((values) => {
      console.log({ ...values, ...info });
      fetchSet({ ...values, ...info });
    });
  };

  const formItems = [
    {
      label: '商圈所属',
      name: 'provinceCode',
      type: 'cascader',
      rules: [{ required: false }],
      disabled: true,
    },
    {
      label: '商圈名称',
      name: 'businessHubName',
    },
    {
      label: '商圈地址',
      name: 'businessHubAddress',
      addonAfter: <a>选地址</a>,
      placeholder: '请选择商圈地址',
      disabled: true,
    },
    {
      label: '商圈经度',
      name: 'lat',
      placeholder: '请选择商圈地址',
      disabled: true,
    },
    {
      label: '商圈纬度',
      name: 'lnt',
      placeholder: '请选择商圈地址',
      disabled: true,
    },
    {
      label: '商圈半径',
      name: 'radius',
      suffix: '米',
      placeholder: '请输入商圈半径（米）',
      addRules: [{ pattern: new RegExp(/^\d$/), message: '请输入数字' }],
    },
    {
      label: '启用状态',
      name: 'status',
      type: 'switch',
      valuePropName: 'checked',
      rules: [{ required: false }],
    },
  ];

  const modalProps = {
    title: `商圈设置`,
    width: 650,
    visible,
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button onClick={handleUpdata} type="primary" loading={loading}>
              确认
            </Button>
          </Space>
        </div>
      }
    >
      <FormComponents form={form} formItems={formItems} initialValues={info}></FormComponents>
    </Drawer>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.tradeArea,
}))(TradeAreaSet);
