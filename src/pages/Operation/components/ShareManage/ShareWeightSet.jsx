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

  const { userMomentIdString: momentId, recommendWeight } = detail;

  const setEdit = () => setEditType(!editType);

  // 提交
  const fetchFormData = () => {
    form.validateFields().then(({ recommendWeight }) => {
      dispatch({
        type: 'shareManage/fetchShareWeightSet',
        payload: {
          momentId,
          recommendWeight: recommendWeight || 0,
        },
        callback: setEdit,
      });
    });
  };
  console.log({ recommendWeight: Number(recommendWeight) });
  return (
    <Form initialValues={{ recommendWeight: Number(recommendWeight) }} form={form}>
      <div style={{ display: 'flex' }}>
        <FormItem noStyle name={'recommendWeight'}>
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
  loading: loading.effects['shareManage/fetchShareLikeSet'],
}))(ShareWeightSet);
