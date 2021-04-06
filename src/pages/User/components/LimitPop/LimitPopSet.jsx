import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const LimitPopSet = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;

  const [form] = Form.useForm();

  // 新增
  const fetchLimitPopAdd = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'serviceLimitPop/fetchLimitPopAdd',
        payload: values,
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '姓名',
      name: 'name',
    },
    {
      label: '手机号',
      name: 'mobile',
    },
  ];

  const modalProps = {
    title: '新增人员',
    visible,
    onClose,
    footer: (
      <Button type="primary" onClick={fetchLimitPopAdd} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['serviceLimitPop/fetchLimitPopAdd'],
}))(LimitPopSet);
