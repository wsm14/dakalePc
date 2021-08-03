import React from 'react';
import { connect } from 'umi';
import { NUM_PATTERN } from '@/common/regExp';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const PromotionMoneySet = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;

  const [form] = Form.useForm();
  const { show = false, info = {}, detail = {}, type } = visible;
  // type--scan :扫码付 extend：推广

  // 提交表单
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      const apiUrl = {
        extend: 'sysTradeList/fetchPromotionMoneySet',
        scan: 'sysTradeList/fetchTradeScanCommissionSet',
      }[type];
      dispatch({
        type: apiUrl, //推广费设置
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
      label: { extend: '推广费比例', scan: '扫码付服务费比例' }[type],
      name: { extend: 'promotionFee', scan: 'scanCommissionRatio' }[type], //
      addRules: [{ pattern: NUM_PATTERN, message: '请输正整数' }],
      addonAfter: '%',
    },
  ];

  // 弹出窗属性
  const modalProps = {
    title: { extend: `推广费 - ${info.categoryName || '类目'}`, scan: '扫码付服务费' }[type],
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
    loading.effects['sysTradeList/fetchPromotionMoneySet'] ||
    loading.effects['sysTradeList/fetchTradeScanCommissionSet'],
}))(PromotionMoneySet);
