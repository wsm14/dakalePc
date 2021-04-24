import React from 'react';
import { Modal, Form } from 'antd';
import FormCondition from '@/components/FormCondition';

const ActiveTemplateNameSet = (props) => {
  const { visible = {}, onClose, callback } = props;

  const { show = '', info = [] } = visible;
  const [form] = Form.useForm();

  // 提交表单
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      callback(values.activeName);
    });
  };

  const formItems = [
    {
      label: '活动名称',
      name: 'activeName',
      onPressEnter: (e) => fetchGetFormData(e.target.value),
    },
  ];

  return (
    <Modal
      title={`活动名称设置 - ${info.title}`}
      width={548}
      destroyOnClose
      visible={show}
      onOk={fetchGetFormData}
      onCancel={onClose}
    >
      <FormCondition form={form} formItems={formItems} initialValues={info}></FormCondition>
    </Modal>
  );
};

export default ActiveTemplateNameSet;
