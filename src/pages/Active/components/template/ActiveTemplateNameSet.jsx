import React from 'react';
import { Modal, Form } from 'antd';
import { ACTIVE_TEMPLATE_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const ActiveTemplateNameSet = (props) => {
  const { visible = {}, onClose, callback } = props;

  const { show = '', info = {} } = visible;

  const [form] = Form.useForm();

  // 提交表单
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      callback(values.activityName);
    });
  };

  const formItems = [
    {
      label: '模版名称',
      name: 'activityName',
      onPressEnter: (e) => fetchGetFormData(e.target.value),
    },
  ];

  return (
    <Modal
      title={`模版名称设置 - ${ACTIVE_TEMPLATE_TYPE[info.type]}`}
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
