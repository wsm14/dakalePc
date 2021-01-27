import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import SubsidyDetail from './Detail/SubsidyDetail';
import SubsidyDirectMoney from './Form/SubsidyDirectMoney';
import SubsidyActionSet from './Form/SubsidyActionSet';

const SubsidyDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'add', tab = 'task', show = false, detail = {} } = visible;
  const [form] = Form.useForm();

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
      }[tab];
      dispatch({
        ...dispatchProps,
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 统一处理
  const drawerProps = {
    // 任务列表
    task: {
      add: {
        title: '新增任务',
        children: <SubsidyDirectMoney form={form} detail={detail}></SubsidyDirectMoney>,
        footer: (
          <Button onClick={handleUpAudit} type="primary" loading={loading}>
            提交
          </Button>
        ),
      },
      info: {
        title: '查看详情',
        children: <SubsidyDetail detail={detail}></SubsidyDetail>,
      },
    }[type],
    // 行为列表
    action: {
      title: type === 'add' ? '新增行为' : '修改行为',
      children: <SubsidyActionSet form={form} detail={detail}></SubsidyActionSet>,
      footer: (
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
  }[tab];

  // 弹出窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: show,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['franchiseApp/fetchFranchiseHandle'],
}))(SubsidyDrawer);
