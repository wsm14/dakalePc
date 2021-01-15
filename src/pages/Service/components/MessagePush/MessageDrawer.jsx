import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import MessageDetail from './Deatil/MessageDetail';
import MessagePushSet from './Form/MessagePushSet';

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

  // 统一处理
  const drawerProps = {
    add: {
      title: '处理',
      children: <MessagePushSet form={form}></MessagePushSet>,
      footer: (
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          提交
        </Button>
      ),
    },
    info: {
      title: '查看推送',
      children: <MessageDetail initialValues={detail}></MessageDetail>,
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
