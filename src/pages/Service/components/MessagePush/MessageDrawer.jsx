import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import MessageDetail from './Deatil/MessageDetail';
import MessagePushSet from './Form/MessagePushSet';

const MessageDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading, userType } = props;

  const { type = 'info', shwo = false, detail = {} } = visible;
  const [form] = Form.useForm();

  // 确认提交
  const handleUpAudit = () => {
    form.validateFields().then((value) => {
      const { pushTime } = value;
      const dispathType = {
        add: 'messagePush/fetchMsgPushAdd',
        edit: 'messagePush/fetchMsgPushEdit',
      }[type];
      dispatch({
        type: dispathType,
        payload: {
          ...value,
          userType,
          pushTime: pushTime ? pushTime.format('YYYY-MM-DD HH:mm:ss') : null,
          id: detail.messagePushId,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 新增修改公共处理
  const addEditProps = {
    children: <MessagePushSet form={form} initialValues={detail}></MessagePushSet>,
    footer: (
      <>
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          创建并推送
        </Button>
        <Button onClick={handleUpAudit} type="primary" loading={loading}>
          保存
        </Button>
      </>
    ),
  };

  // 统一处理
  const drawerProps = {
    add: {
      title: '新增推送',
      ...addEditProps,
    },
    edit: {
      title: '修改推送',
      ...addEditProps,
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
