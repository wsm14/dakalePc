import aliOssUpload from '@/utils/aliOssUpload';
import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const FAQSortSet = (props) => {
  const { dispatch, visibleSet, onClose, loading } = props;
  const { childRef, qRef, initialValues = {}, setType, show = false } = visibleSet;

  const [form] = Form.useForm();

  // 提交表单
  const fetchDataEdit = () => {
    form.validateFields().then((values) => {
      const { image } = values;
      aliOssUpload(image).then((res) => {
        dispatch({
          type: { add: 'serviceFAQ/fetchFAQSortAdd', edit: 'serviceFAQ/fetchFAQSortEdit' }[setType],
          payload: {
            id: initialValues.questionCategoryIdString,
            ...values,
            image: res.toString(),
          },
          callback: () => {
            onClose();
            childRef.current.fetchGetData();
            qRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: 'FAQ分类名称',
      name: 'questionCategoryName',
      maxLength: 10,
    },
    {
      label: '分类图',
      type: 'upload',
      name: 'image',
      maxFile: 1,
      isCut: true,
      imgRatio: 108 / 108,
      rules: [{ required: false }],
    },
  ];

  const modalProps = {
    title: `${{ add: '新增分类', edit: '修改分类' }[setType]}`,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={() => fetchDataEdit()} loading={loading}>
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
  loading: loading.models.serviceFAQ,
}))(FAQSortSet);
