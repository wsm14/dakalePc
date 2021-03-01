import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const TradeCategorySet = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;

  const [form] = Form.useForm();
  const { show = false, type = 'add', detail = {} } = visible;

  // 提交表单
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: { add: 'sysTradeList/fetchTradeAdd', edit: 'sysTradeList/fetchTradeSet' }[type],
        payload: { ...detail, ...values },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '父级类目',
      name: 'parentName',
      visible: detail.type === 'second',
      disabled: true,
    },
    {
      label: '一级类目名称',
      name: 'categoryName',
      visible: detail.type === 'first',
      maxLength: 10,
    },
    {
      label: '二级类目名称',
      visible: detail.type === 'second',
      name: 'categoryName',
      maxLength: 10,
    },
    {
      label: '类目名称',
      visible: type === 'edit',
      name: 'categoryName',
      maxLength: 10,
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: `${type === 'add' ? '新增类目' : '编辑类目'}`,
    visible: show,
    onClose,
    footer: (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        提交
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
  loading:
    loading.effects['sysTradeList/fetchTradeAdd'] || loading.effects['sysTradeList/fetchTradeSet'],
}))(TradeCategorySet);
