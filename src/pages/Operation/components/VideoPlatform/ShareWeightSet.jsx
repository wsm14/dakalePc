import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { Form, InputNumber, Button } from 'antd';
import FormCondition from '@/components/FormCondition';

const FormItem = Form.Item;

/**
 * 视频权重设置
 */
const ShareWeightSet = ({ detail, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const [editType, setEditType] = useState(false);

  const { momentId, weight, ownerId } = detail;

  const setEdit = () => setEditType(!editType);

  // 提交
  const fetchFormData = () => {
    form.validateFields().then(({ weight }) => {
      onSubmit(
        {
          momentId,
          ownerId,
          weight,
          flag: 'updateWeight',
        },
        setEdit,
      );
    });
  };
  useEffect(() => {
    weight && form.setFieldsValue({ weight: Number(weight) });
  }, [weight]);

  return (
    <Form initialValues={{ weight: Number(weight) }} form={form}>
      <div style={{ display: 'flex' }}>
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

export default connect(({ loading }) => ({
  loading: loading.effects['videoPlatform/fetchNewShareNoAudit'],
}))(ShareWeightSet);
