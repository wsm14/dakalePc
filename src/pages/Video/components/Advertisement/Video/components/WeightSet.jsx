import React, { useState } from 'react';
import { connect } from 'umi';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { Form, InputNumber, Button } from 'antd';
import FormCondition from '@/components/FormCondition';

const FormItem = Form.Item;

/**
 * 视频权重设置
 */
const ShareWeightSet = ({ detail, dispatch }) => {
  const [form] = Form.useForm();
  const [editType, setEditType] = useState(false);

  const { platformMomentId, weight } = detail;

  const setEdit = () => setEditType(!editType);

  // 提交
  const fetchFormData = () => {
    form.validateFields().then(({ weight }) => {
      dispatch({
        type: 'videoAdvert/fetchVideoAdvertEdit',
        payload: {
          platformMomentId,
          weight: weight || 0,
        },
        callback: setEdit,
      });
    });
  };

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
          icon={!editType ? <EditOutlined /> : <CheckOutlined />}
          onClick={!editType ? setEdit : fetchFormData}
        ></Button>
      </div>
    </Form>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['videoAdvert/fetchVideoAdvertEdit'],
}))(ShareWeightSet);
