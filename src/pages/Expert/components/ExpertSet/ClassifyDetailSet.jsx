import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const ClassifyDetailSet = (props) => {
  const { dispatch, childRef, visible, onClose } = props;
  const { type, show = false, initialValues = {}, domainId } = visible;

  const [form] = Form.useForm();

  // 提交表单
  const fetchDataEdit = () => {
    form.validateFields().then((values) => {
      const { image } = values;
      const editType = !initialValues.topicId;
      aliOssUpload(image).then((res) => {
        dispatch({
          type: {
            true: 'expertSet/fetchClassifyDetailAdd',
            false: 'expertSet/fetchClassifyDetailSet',
          }[editType],
          payload: {
            ...initialValues,
            ...values,
            domainId,
            image: res.toString(),
          },
          callback: () => {
            onClose();
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: `图片`,
      type: 'upload',
      name: 'image',
      maxFile: 1,
    },
    {
      label: `话题名称`,
      name: 'topicName',
      maxLength: 10,
    },
    {
      label: `说明`,
      name: 'topicDesc',
    },
  ];

  const modalProps = {
    title: `设置 - 话题`,
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

export default connect(({ expertSet, loading }) => ({
  expertSet,
  loading,
}))(ClassifyDetailSet);
