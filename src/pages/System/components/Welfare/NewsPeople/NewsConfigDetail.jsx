import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, Input, Checkbox, InputNumber } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import moment from 'moment';

const NewsConfigDetail = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;
  const { show = false, type = 'add', detail = { orderFee: 0 } } = visible;
  const { status } = detail;

  const [form] = Form.useForm();

  const titles = {
    add: {
      title: '新增',
    },
    edit: {
      title: '修改',
    },
  }[type];

  const formItems = [
    {
      label: '福利名称',
      name: 'name',
    },
    {
      type: 'formItem',
      label: '福利限制',
      required: true,
      formItem: (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Form.Item
            name="verificationDay"
            rules={[{ required: true, message: '请输入几天内核销' }]}
          >
            <InputNumber style={{ width: '150px' }} />
          </Form.Item>
          <div style={{ lineHeight: '30px' }}>天内核销</div>
          <Form.Item name="orderNum" rules={[{ required: true, message: '请输入核销单数' }]}>
            <InputNumber style={{ width: '150px' }} />
          </Form.Item>
          <div style={{ lineHeight: '30px' }}>单</div>
        </div>
      ),
    },
    {
      label: '成立条件',
      type: 'formItem',
      formItem: (
        <>
          <Form.Item name="isBeanPay">
            <Checkbox.Group>
              <Checkbox value="1" style={{ lineHeight: '32px' }}>
                必须使用卡豆支付
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="每单实付满" name="orderFee">
            <Input suffix="元" style={{ width: '120px' }} />
          </Form.Item>
        </>
      ),
    },

    {
      label: '活动时间',
      name: 'activityTime',
      type: 'rangePicker',
      disabled: status > 0,
    },
  ];
  const save = () => {
    form.validateFields().then((values) => {
        console.log(values)
      const { activityTime } = values;
      delete values.activityTime;
      const payload = {
        ...values,
        configNewcomerOrdersId: detail.configNewcomerOrdersId,
        isBeanPay: Array.isArray(values.isBeanPay)?values.isBeanPay[0]:values.isBeanPay,
        activityStartDay: activityTime[0].format('YYYY-MM-DD'),
        activityEndDay: activityTime[1].format('YYYY-MM-DD'),
      };

      dispatch({
        type: 'welfareConfigList/fetchWelfareUpdates',
        payload,
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    title: titles.title,
    visible: show,
    onClose,
    footer: (
      <Button type="primary" loading={loading} onClick={save}>
        保存
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} initialValues={detail} form={form}></FormCondition>
    </DrawerCondition>
  );
};
export default connect(({ loading }) => ({
  loading: loading.effects['welfareConfigList/fetchWelfareUpdates'],
}))(NewsConfigDetail);
