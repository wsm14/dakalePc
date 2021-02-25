import { EXPERT_SORT_TYPE } from '@/common/constant';
import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const SortSet = (props) => {
  const { dispatch, childRef, visible ,onClose} = props;
  const { show = false, initialValues = {} } = visible;

  const [form] = Form.useForm();

  // 提交表单
  const fetchDataEdit = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'expertSort/fetchExpertSortSet',
        payload: {
          ...initialValues,
          ...values,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };
  const formItems = [
    {
      label: '设置数值',
      name: 'value',
      type: 'number',
    },
  ];
  const modalProps = {
    title: `设置数值 - ${EXPERT_SORT_TYPE[initialValues.key]}`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={fetchDataEdit}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ expertSort, loading }) => ({
  expertSort,
  loading,
}))(SortSet);
