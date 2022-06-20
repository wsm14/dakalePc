import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const AddressDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { show = false, detail = {} } = visible;
  const [form] = Form.useForm();

  //提交发货
  const handleUpAudit = () => {
    form.validateFields().then((value) => {
      const { orderId, userId } = detail;
      const { city, ...other } = value;
      dispatch({
        type: 'ordersList/fetchDeliverGoods',
        payload: {
          orderId,
          userId,
          orderLogistic: {
            ...other,
            provinceCode: city[0],
            cityCode: city[1],
            districtCode: city[2],
          },
        },
        callback: () => {
          onClose();
        },
      });
    });
  };

  const formItems = [
    {
      label: '姓名',
      name: 'addressName',
    },
    {
      label: '手机号码',
      name: 'mobile',
    },
    {
      label: '省市区',
      name: 'city',
      type: 'cascader',
    },
    {
      label: '详细地址',
      name: 'address',
    },
    {
      label: '邮政编码',
      name: 'postalCode',
      required: false,
      rules: [{ required: false }],
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: `修改地址`,
    visible: show,
    onClose,
    footer: (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['ordersList/fetchOrderDetail'],
}))(AddressDrawer);
