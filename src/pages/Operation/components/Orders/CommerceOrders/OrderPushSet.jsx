import React, { useState } from 'react';
import { Form, Space, Typography, Input } from 'antd';
import FormCondition from '@/components/FormCondition';

const OrderPushSet = (props) => {
  const { form, initialValues } = props;
  const [disabled, setDisabled] = useState(true);

  const formItems = [
    {
      label: '物流公司',
      name: 'logisticsCompany',
    },
    {
      label: '物流单号',
      name: 'logisticsNum',
    },
    {
      label: '姓名',
      name: 'logisticsNum',
      disabled,
    },
    {
      label: '手机号码',
      name: 'logisticsNum',
      disabled,
    },
    {
      label: '省市区',
      name: 'logisticsNum',
      type: 'cascader',
      changeOnSelect: true,
      disabled,
      valuesKey: ['provinceCode', 'cityCode', 'districtCode'],
    },
    {
      label: '详细地址',
      name: 'logisticsNum',
      disabled,
    },
    {
      label: '邮政编码',
      type: 'formItem',
      name: 'logisticsNum',
      formItem: (
        <Space>
          <Form.Item
            name="username"
            noStyle
            rules={[{ required: true, message: '请确认邮政编码' }]}
          >
            <Input style={{ width: 160 }} placeholder="请输入邮政编码" disabled={disabled} />
          </Form.Item>
          <Typography.Link onClick={() => checkDisabled()}>
            {disabled ? '编辑' : '保存'}
          </Typography.Link>
        </Space>
      ),
    },
  ];

  const checkDisabled = () => {
    if (disabled) {
      setDisabled(!disabled);
    } else {
      form.validateFields().then((values) => {
        console.log(values);
      });
    }
  };

  return (
    <>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </>
  );
};

export default OrderPushSet;
