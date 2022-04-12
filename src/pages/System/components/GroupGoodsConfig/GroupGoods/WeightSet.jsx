import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { Form, InputNumber, Button } from 'antd';
import FormCondition from '@/components/FormCondition';

const FormItem = Form.Item;

/**
 * 视频权重设置
 */
const WeightSet = ({ detail, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [editType, setEditType] = useState(false);

  const { togetherGroupConfigId, sort } = detail;

  const setEdit = () => setEditType(!editType);

  // 提交
  const fetchFormData = () => {
    form.validateFields().then(({ sort }) => {
      onSubmit(
        {
          flag: 'updateWeight',
          togetherGroupConfigId,
          sort,
        },
        setEdit,
      );
    });
  };
  useEffect(() => {
    sort && form.setFieldsValue({ sort: Number(sort) });
  }, [sort]);
  
  return (
    <Form initialValues={{ sort: Number(sort) }} form={form}>
      <div style={{ display: 'flex' }}>
        <FormItem noStyle name={'sort'}>
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

export default connect(({ loading }) => ({
  loading: loading.effects['marketConfigure/fetchGlobalPopUpEdit'],
}))(WeightSet);
