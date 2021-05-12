import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import WithdrawFormList from './WithdrawFormList';

const ProceDataForm = (props) => {
  const { cRef, visible = {}, onClose } = props;
  const { show = false, type = 'add', detail = { names: [{}, {}] } } = visible;
  const [form] = Form.useForm();

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log(values, '222');
    });
  };

  const formItems = [
    {
      label: '地区',
      name: 'city',
      type: 'cascader',
    },
    {
      type: 'noForm',
      formItem: <WithdrawFormList form={form}></WithdrawFormList>,
    },
    {
      label: '生效日期',
      name: 'time',
      type: 'rangePicker',
    },
  ];
  const modalProps = {
    title: '提现手续费',
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave}>
        保存
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};
export default ProceDataForm;
