import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import SaleAccountDetail from './Detail/SaleAccountDetail';
import SubsidyActionSet from './Form/SubsidyActionSet';

const SaleAccountDrawer = (props) => {
  const { dispatch, visible, childRef, setVisible, loading } = props;

  const [form] = Form.useForm();
  const { type = 'add', show = false, detail = {} } = visible;

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((payload) => {
      const dispatchProps = {
        task: { type: 'subsidyManage/fetchSubsidyTaskAdd', payload },
        action: {
          type: 'subsidyManage/fetchSubsidyActionAdd',
          payload: {
            ...payload,
            id: detail.configBehaviorId,
          },
        },
      }[type];
      dispatch({
        ...dispatchProps,
        callback: () => {
          setVisible(false);
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 统一处理
  const drawerProps = {
    detail: {
      title: '查看详情',
      children: <SaleAccountDetail form={form} detail={detail}></SaleAccountDetail>,
      footer: (
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
    add: {
      title: '新增账户',
      children: <SubsidyActionSet form={form} detail={detail}></SubsidyActionSet>,
      footer: (
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
    edit: {
      title: '修改账户',
      children: <SubsidyActionSet form={form} detail={detail}></SubsidyActionSet>,
      footer: (
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
  }[type];

  // 弹出窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose: () => setVisible(false),
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['franchiseApp/fetchFranchiseHandle'],
}))(SaleAccountDrawer);
