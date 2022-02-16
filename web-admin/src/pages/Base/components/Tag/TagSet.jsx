import React from 'react';
import { connect } from 'umi';
import { MRE_TAG_STATUS } from '@/common/constant';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const ClassifySet = (props) => {
  const { dispatch, visible = {}, onClose, cRef, loading } = props;
  const { type = '', detail = {} } = visible;
  const [form] = Form.useForm();

  // 确认数据
  const fetchUpData = () => {
    form.validateFields().then((values) => {
      const { configMerchantId } = detail;
      dispatch({
        type: {
          add: 'tagManage/fetchTagAdd',
          edit: 'tagManage/fetchTagEdit',
        }[type],
        payload: {
          ...values,
          configMerchantId,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '标签名称',
      name: 'tagName',
      maxLength: 10,
    },
    {
      label: '标签状态',
      name: 'status',
      type: 'radio',
      visible: type === 'edit',
      select: MRE_TAG_STATUS,
    },
  ];

  const modalProps = {
    title: '设置分类',
    visible: !!type,
    onClose,
    footer: (
      <Button onClick={fetchUpData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} initialValues={detail} />
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.models.tagManage,
}))(ClassifySet);
