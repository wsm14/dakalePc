import React, { useState, useEffect } from 'react';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { Form, InputNumber, Button } from 'antd';
import FormCondition from '@/components/FormCondition';

const FormItem = Form.Item;

/**
 * 视频权重设置
 */
const SortValueSet = ({ value, valueKey = 'sortValue', onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [editType, setEditType] = useState(false);

  useEffect(() => {
    value && form.setFieldsValue({ weight: Number(value) });
  }, [value]);

  const setEdit = () => {
    setEditType(!editType);
  };

  // 提交
  const fetchFormData = () => {
    form.validateFields().then(({ weight }) => {
      onSubmit({ [valueKey]: weight });
      setEdit();
    });
  };

  return (
    <Form initialValues={{ weight: Number(value || 0) }} form={form}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FormItem noStyle name={'weight'}>
          <InputNumber disabled={!editType} />
        </FormItem>
        <Button
          style={{ width: 32 }}
          type="link"
          block
          loading={loading}
          icon={!editType ? <EditOutlined /> : <CheckOutlined />}
          onClick={!editType ? setEdit : fetchFormData}
        ></Button>
      </div>
    </Form>
  );
};

export default SortValueSet;
