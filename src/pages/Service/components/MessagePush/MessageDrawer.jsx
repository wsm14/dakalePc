import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { MSG_PSUH_TAB } from '@/common/constant';
import AuthConsumer from '@/layouts/AuthConsumer';
import DrawerCondition from '@/components/DrawerCondition';
import MessageDetail from './Deatil/MessageDetail';
import MessagePushSet from './Form/MessagePushSet';

const MessageDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading, userType } = props;

  const { type = 'info', shwo = false, detail = {} } = visible;
  const [form] = Form.useForm();

  // 确认提交 now 新增并推送时传参 用来区分是不是创建并保存接口调用
  // { '': '无', h5: 'H5', native: 'inside' };
  const handleUpAudit = (now) => {
    form.validateFields().then((value) => {
      const { pushTime, jumpUrlType, jumpUrl } = value;
      const dispathType =
        now === 'too'
          ? 'messagePush/fetchMsgAddAndPush' // 新增并推送
          : {
              add: 'messagePush/fetchMsgPushAdd', // 新增
              edit: 'messagePush/fetchMsgPushEdit', // 修改
            }[type];
      dispatch({
        type: dispathType,
        payload: {
          ...value,
          userType,
          link: jumpUrl,
          linkType: { '': '', H5: 'h5', inside: 'native' }[jumpUrlType],
          pushTime: pushTime ? pushTime.format('YYYY-MM-DD HH:mm') : null,
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
        {/* 修改时只有保存按钮 新增时有这个按钮 */}
        <AuthConsumer auth="push" show={type === 'add'}>
          <Button onClick={() => handleUpAudit('too')} type="primary" loading={loading}>
            创建并推送
          </Button>
        </AuthConsumer>
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
    title: `${drawerProps.title} - ${MSG_PSUH_TAB[userType]}`,
    visible: shwo,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['franchiseApp/fetchFranchiseHandle'],
}))(MessageDrawer);
