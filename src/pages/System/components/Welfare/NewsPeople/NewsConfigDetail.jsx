import React from 'react';
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

  const getChangeval = (val) => {
    if (val.length == 0) {
      form.setFieldsValue({
        isBeanPay: '0',
      });
    }
  };

  const formItems = [
    {
      label: '福利名称',
      name: 'name',
      maxLength: 20,
    },
    {
      type: 'formItem',
      label: '福利限制',
      required: true,
      formItem: (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item
            name="verificationDay"
            rules={[{ required: true, message: '请输入几天内核销' }]}
          >
            <InputNumber style={{ width: '150px' }} min={1} max={99} precision={0} />
          </Form.Item>
          <div style={{ lineHeight: '30px' }}>天内核销</div>
          <Form.Item name="orderNum" rules={[{ required: true, message: '请输入核销单数' }]}>
            <InputNumber style={{ width: '150px' }} min={1} max={99} precision={0} />
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
            <Checkbox.Group onChange={getChangeval}>
              <Checkbox value="1" style={{ lineHeight: '32px' }}>
                必须使用卡豆支付
              </Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <div style={{display:'flex'}}>
            <Form.Item label="每单实付满" name="orderFee">
              <InputNumber style={{ width: '120px' }} min={0} max={9999} />
            </Form.Item>
            <div style={{ lineHeight: '30px',marginLeft:'10px' }}>元</div>
          </div>
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

  //提交表单数据
  const save = () => {
    form.validateFields().then((values) => {
      const { activityTime } = values;
      delete values.activityTime;
      const payload = {
        ...values,
        configNewcomerOrdersId: detail.configNewcomerOrdersId,
        isBeanPay: values.isBeanPay ? values.isBeanPay[0] : '0',
        activityStartDay: activityTime[0].format('YYYY-MM-DD'),
        activityEndDay: activityTime[1].format('YYYY-MM-DD'),
      };
      console.log(payload,"payload")
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
