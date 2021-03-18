import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import CouponDetail from './Detail/PreferentialDetail';
import PreferentialSet from './Form/PreferentialSet';
import PreferentialRuleSet from './Form/PreferentialRuleSet';

const PreferentialDrawer = (props) => {
  const { visible, dispatch, childRef, onClose, loading } = props;

  const { type = 'info', show = false, detail = {} } = visible;
  const [form] = Form.useForm();
  const [visibleRule, setVisibleRule] = useState({ show: false, preData: {} });

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((values) => {
      setVisibleRule({ show: true, preData: values });
    });
  };

  // 统一处理弹窗
  const drawerProps = {
    info: {
      title: '活动详情',
      children: <CouponDetail initialValues={detail}></CouponDetail>,
    },
    add: {
      title: '新增活动',
      children: <PreferentialSet form={form} initialValues={detail}></PreferentialSet>,
    },
  }[type];

  // 弹窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    closeCallBack: () => dispatch({ type: 'businessList/close' }), // 关闭清空搜索的商家数据
    footer: (
      <Button onClick={handleUpAudit} type="primary" loading={loading}>
        下一步
      </Button>
    ),
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        {drawerProps.children}
        <PreferentialRuleSet
          form={form}
          visible={visibleRule}
          onClose={() => setVisibleRule(false)}
        ></PreferentialRuleSet>
      </DrawerCondition>
    </>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['couponManage/fetchCouponSave'],
}))(PreferentialDrawer);
