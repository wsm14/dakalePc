import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, InputNumber } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';

const GlobalModalDrawerSet = (props) => {
  const { visible, onClose, dispatch, loading, handleInfo } = props;
  const { show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  //保存
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      // console.log(values);

      dispatch({
        type: 'marketConfigure/fetchSetWeeklyCard',
        payload: values,
        callback: () => {
          onClose();
          handleInfo();
        },
      });
    });
  };

  const formItems = [
    {
      label: '周卡名称',
      name: 'name',
      maxLength: '15',
    },
    {
      label: '原价',
      name: 'originalPrice',
      type: 'number',
      addonBefore: '￥',
      rules: [{ required: false }],
      precision: 2,
    },
    {
      label: '售价',
      name: 'price',
      type: 'number',
      addonBefore: '￥',
      precision: 2,
    },

    {
      label: '奖励卡豆数',
      name: 'firstReceiveBean',
      type: 'number',
      addonBefore: '首次领取',
      addonAfter: '卡豆',
      precision: 0,
      min: 0,
    },
    {
      type: 'noForm',
      formItem: (
        <div style={{ marginLeft: 150, marginBottom: 24 }}>
          <Form.Item
            name={'otherMinBean'}
            noStyle
            rules={[{ required: true, message: '请输入奖励卡豆' }]}
            placeholder="请输入卡豆数"
          >
            <InputNumber
              min={0}
              precision={0}
              addonBefore="其余天数"
              addonAfter="卡豆"
              style={{ width: '50%' }}
            />
          </Form.Item>
          <span>---</span>
          <Form.Item
            name={'otherMaxBean'}
            noStyle
            rules={[{ required: true, message: '请输入奖励卡豆' }]}
            placeholder="请输入卡豆数"
          >
            <InputNumber min={0} precision={0} addonAfter="卡豆" style={{ width: '40%' }} />
          </Form.Item>
        </div>
      ),
    },
    {
      label: '续费规则',
      name: 'day',
      type: 'number',
      addonBefore: '到期前',
      addonAfter: '天可购买下一周周卡。',
      precision: 0,
      min: 0,
    },
    {
      label: '启用状态',
      name: 'status',
      type: 'switch',
    },
  ];

  const modalProps = {
    visible: show,
    title: '编辑',
    onClose,
    zIndex: 1001,
    footer: (
      <Button type="primary" onClick={handleSave} loading={loading}>
        保存
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['marketConfigure/fetchSetWeeklyCard'],
}))(GlobalModalDrawerSet);
