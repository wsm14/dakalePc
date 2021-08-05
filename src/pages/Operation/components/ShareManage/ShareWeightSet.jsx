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
  
  const { userMomentIdString: momentId } = detail;

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

  return (
    <Form initialValues={detail} form={form}>
      <FormItem noStyle name={'recommendWeight'}>
        <div style={{ display: 'flex' }}>
          <InputNumber disabled={!editType} />
          <Button
            style={{ width: 32 }}
            type="link"
            block
            icon={!editType ? <EditOutlined /> : <CheckOutlined />}
            onClick={!editType ? setEdit : fetchFormData}
          ></Button>
        </div>
      </FormItem>
    </Form>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['shareManage/fetchShareLikeSet'],
}))(ShareWeightSet);
