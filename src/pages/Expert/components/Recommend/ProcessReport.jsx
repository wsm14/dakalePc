import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const ProcessReport = (props) => {
  const { dispatch, childRef, visible, onClose, fetchExpertCountReport, loading } = props;
  const { show = false, initialValues = {} } = visible;
  const [form] = Form.useForm();

  // 下架
  const fetchStatusClose = () => {
    form.validateFields().then((payload) => {
      dispatch({
        type: 'expertRecommend/fetchExpertProcessReport',
        payload: {
          ...initialValues,
          ...payload,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
          fetchExpertCountReport();
        },
      });
    });
  };

  const formItems = [
    {
      label: '处理说明',
      name: 'processResult',
      type: 'textArea',
    },
    {
      label: '内容处理',
      name: 'processStatus',
      type: 'radio',
      select: ['下架', '警告', '正常'],
    },
  ];

  const modalProps = {
    title: `举报处理`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={() => fetchStatusClose()} loading={loading}>
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
export default connect(({ loading }) => ({
  loading: loading.models.expertRecommend,
}))(ProcessReport);
