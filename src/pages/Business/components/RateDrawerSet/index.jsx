import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import RateFormList from './RateFormList';

const ReteDrawerSet = (props) => {
  const { visible = {}, onClose } = props;
  const { type, show, initialValues = {} } = visible;
  // type merchant:'门店' ，group：集团

  const [form] = Form.useForm();

  const formContent = [
    {
      title: '扫码付',
      formItems: [
        {
          label: '行业通用费率',
          name: 'rate',
          // disabled: true,
        },
        {
          label: '特殊费率',
          type: 'formItem',
          formItem: <RateFormList name="scanObj"></RateFormList>,
        },
      ],
    },
    {
      title: '核销订单',
      formItems: [
        {
          label: '行业通用费率',
          name: 'rate',
          // disabled: true,
        },
        {
          label: '特殊费率',
          type: 'formItem',
          formItem: <RateFormList name="vertisionObj"></RateFormList>,
        },
      ],
    },
    {
      title: '推广费',
      formItems: [
        {
          label: '行业通用费率',
          name: 'rate',
          // disabled: true,
        },
        {
          label: '特殊费率',
          type: 'formItem',
          formItem: <RateFormList name="extendObj"></RateFormList>,
        },
      ],
    },
  ];

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log(values, 'sss');
    });
  };

  const modalProps = {
    title: '费率设置--',
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
      {formContent.map((item, index) => (
        <div key={index}>
          <div style={{ fontSize: 16, fontWeight: 'bold', margin: 15 }}>{item.title}</div>
          <FormCondition
            form={form}
            formItems={item.formItems}
            initialValues={initialValues}
          ></FormCondition>
        </div>
      ))}
    </DrawerCondition>
  );
};

export default connect()(ReteDrawerSet);
