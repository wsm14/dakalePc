import React, { useState } from 'react';
import { connect } from 'umi';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { authCheck } from '@/layouts/AuthConsumer';
import { Form, InputNumber, Button } from 'antd';
import FormCondition from '@/components/FormCondition';

const FormItem = Form.Item;

/**
 * 权重设置
 */
const WeightSet = ({
  detail,
  dispatch,
  dispatchType = 'specialGoods/fetchSetTopRecommendWeight',
  params = {},
  childRef,
}) => {
  const [form] = Form.useForm();
  const [editType, setEditType] = useState(false);

  const editAuth = authCheck(['weight']);

  const { weight } = detail;

  const setEdit = () => setEditType(!editType);

  // 提交
  const fetchFormData = () => {
    form.validateFields().then(({ weight }) => {
      const payload = {
        ...params,
        weight: weight || 0,
      };
      dispatch({
        type: dispatchType,
        payload,
        callback:()=>{
          childRef.current.fetchGetData();
          setEdit()
        } 
      });
    });
  };

  return (
    <Form initialValues={{ weight: weight}} form={form}>
      <div style={{ display: 'flex' }}>
        <FormItem noStyle name={'weight'}>
          <InputNumber disabled={!editType} />
        </FormItem>
        {editAuth && (
          <Button
            style={{ width: 32 }}
            type="link"
            block
            icon={!editType ? <EditOutlined /> : <CheckOutlined />}
            onClick={!editType ? setEdit : fetchFormData}
          ></Button>
        )}
      </div>
    </Form>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSetTopRecommendWeight'],
}))(WeightSet);
