import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import SubsidyDetail from './Detail/SubsidyDetail';
import SubsidyDirectMoney from './Form/SubsidyDirectMoney';

const SubsidyDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'add', tab = 'task', show = false, detail = {} } = visible;
  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((value) => {
      dispatch({
        type: 'subsidyManage/fetchSubsidyAdd',
        payload: {
          ...value,
        },
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
      add: {
        title: '新增行为',
        children: '<SubsidyDirectMoney form={form} detail={detail}></SubsidyDirectMoney>',
        footer: (
          <Button onClick={handleUpAudit} type="primary" loading={loading}>
            提交
          </Button>
        ),
      },
      edit: {
        title: '修改行为',
        children: '<SubsidyDetail detail={detail}></SubsidyDetail>',
      },
    }[type],
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
