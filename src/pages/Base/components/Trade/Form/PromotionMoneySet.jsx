import React from 'react';
import { connect } from 'umi';
import { NUM_PATTERN } from '@/common/regExp';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const PromotionMoneySet = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;

  const [form] = Form.useForm();
  const { show = false, info = {}, detail = {} } = visible;

  // 提交表单
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'sysTradeList/fetchPromotionMoneySet',
        payload: { categoryId: info.categoryIdString, ...values },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '推广费比例',
      name: 'promotionFee',
      addRules: [{ pattern: NUM_PATTERN, message: '请输正整数' }],
      addonAfter: '%',
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: `推广费 - ${info.categoryName || '类目'}`,
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
  loading: loading.effects['sysTradeList/fetchPromotionMoneySet'],
}))(PromotionMoneySet);
