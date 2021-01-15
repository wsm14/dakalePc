import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import MessageDetail from './Deatil/MessageDetail';

const MessageDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'info', shwo = false, detail = {} } = visible;
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
    handle: {
      title: '处理',
      children: <FormCondition form={form} formItems={formItems}></FormCondition>,
      footer: (
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
    info: {
      title: '查看推送',
      children: <MessageDetail formItems={formItems} initialValues={detail}></MessageDetail>,
    },
  }[type];

  // 弹出窗属性
  const modalProps = {
    title: drawerProps.title,
    visible: shwo,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['franchiseApp/fetchFranchiseHandle'],
}))(MessageDrawer);
