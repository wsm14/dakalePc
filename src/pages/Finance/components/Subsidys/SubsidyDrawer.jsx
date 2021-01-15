import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import SubsidyDetail from './Detail/SubsidyDetail';

const SubsidyDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'info', show = false, detail = {} } = visible;
  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((value) => {
      dispatch({
        type: 'franchiseApp/fetchFranchiseHandle',
        payload: {
          ...value,
          userApplyId: detail.userApplyIdString,
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
      label: '处理详情',
      type: 'textArea',
      name: 'handleDetails',
    },
    {
      label: '处理人',
      name: 'handler',
      visible: type === 'info',
    },
    {
      label: '处理时间',
      name: 'handleTime',
      visible: type === 'info',
    },
  ];

  // 统一处理
  const drawerProps = {
    add: {
      title: '新增任务',
      children: <FormCondition form={form} formItems={formItems}></FormCondition>,
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
  }[type];

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
