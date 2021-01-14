import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const FranchiseDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { shwo = false, detail = {} } = visible;
  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((value) => {
      dispatch({
        type: 'withdrawDetail/fetchWithdrawSetRemark',
        payload: {
          ...value,
          id: detail.merchantBeanWithdrawalId,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '备注详情',
      type: 'textArea',
      name: 'remark',
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: '备注信息',
    visible: shwo,
    onClose,
    footer: (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        修改
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
  loading: loading.effects['withdrawDetail/fetchWithdrawSetRemark'],
}))(FranchiseDrawer);
