import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { SQUARE_ICON } from '@/common/imgRatio';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const FAQSortSet = (props) => {
  const { dispatch, visibleSet, onClose, childRef, loading } = props;
  const { initialValues = {}, type, show = false } = visibleSet;

  const [form] = Form.useForm();

  // 提交表单
  const fetchDataEdit = () => {
    form.validateFields().then((values) => {
      const { image } = values;
      aliOssUpload(image).then((res) => {
        dispatch({
          type: { add: 'serviceFAQ/fetchFAQSortAdd', edit: 'serviceFAQ/fetchFAQSortEdit' }[type],
          payload: {
            id: initialValues.questionCategoryIdString,
            ...values,
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
      label: 'FAQ分类名称',
      name: 'questionCategoryName',
      maxLength: 10,
    },
    {
      label: '分类图',
      type: 'upload',
      name: 'image',
      maxFile: 1,
      imgRatio: SQUARE_ICON,
      rules: [{ required: false }],
    },
  ];

  const modalProps = {
    title: `${{ add: '新增分类', edit: '修改分类' }[type]}`,
    visible: show,
    onClose,
    zIndex: 99999,
    footer: (
      <Button type="primary" onClick={fetchDataEdit} loading={loading}>
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
