import React, { useRef } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormComponents from '@/components/FormCondition';

import DrawerCondition from '@/components/DrawerCondition';

const UserDrawerSet = () => {
  const [form] = Form.useForm();

  const modalProps = {
    visible: 'true',
    title: '营销码配置',
  };

  const formItems = [
    {
      label: '配置名称',
      name: 'roleName',
    },
    {
      label: '选择店铺',
      name: 'remark',
      type: 'textArea',
      rules: [{ required: false }],
    },
]

  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form}></FormComponents>
    </DrawerCondition>
  );
};

export default connect()(UserDrawerSet);
