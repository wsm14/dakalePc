import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import DrawerCondition from '@/components/DrawerCondition';
import MessageDetail from './Deatil/MessageDetail';
import MarketActivityBaseForm from './Form/BaseForm';

const MarketActivityDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading, userType } = props;

  const { type = 'info', shwo = false, detail = {} } = visible;
  const [form] = Form.useForm();

  const handleUpData = () => {
    form.validateFields().then((value) => {
      const { pushTime, jumpUrlType, jumpUrl, pushObjectIds = [] } = value;
      dispatch({
        type: {
          add: 'messagePush/fetchMsgPushAdd', // 新增
          edit: 'messagePush/fetchMsgPushEdit', // 修改
        }[type],
        payload: {
          ...value,
          pushObjectIds: pushObjectIds.toString(),
          userType,
          link: jumpUrl,
          linkType: jumpUrlType,
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
    children: (
      <MarketActivityBaseForm form={form} initialValues={detail} userType={userType}></MarketActivityBaseForm>
    ),
    footer: (
      <AuthConsumer auth="save" show={type === 'add'}>
        <Button onClick={handleUpData} type="primary" loading={loading}>
          确定
        </Button>
      </AuthConsumer>
    ),
  };

  // 统一处理
  const drawerProps = {
    add: {
      title: '新建活动',
      ...addEditProps,
    },
    edit: {
      title: '修改活动',
      ...addEditProps,
    },
    info: {
      title: '查看活动',
      children: <MessageDetail initialValues={detail}></MessageDetail>,
    },
  }[type];

  // 弹出窗属性
  const modalProps = {
    title: `${drawerProps.title}`,
    visible: shwo,
    width: 700,
    onClose,
    footer: drawerProps.footer,
  };

  return <DrawerCondition {...modalProps}>{drawerProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['franchiseApp/fetchFranchiseHandle'],
}))(MarketActivityDrawer);
