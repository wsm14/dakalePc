import React from 'react';
import { connect } from 'umi';
import { Button, Modal, Tabs } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import UserBaseDetail from './Detail/UserBaseDetail';
import UserRealDetail from './Detail/UserRealDetail';

const UserDetailShow = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { shwo = false, detail = {} } = visible;

  const { status, userIdString } = detail;

  const statusNum = Number(status);
  const statusText = !statusNum ? '启用' : '封停';

  // 账户状态
  const handleUserStatus = () => {
    Modal.confirm({
      title: `确认${statusText}该账户`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'userList/fetchUserStatus',
          payload: { userId: userIdString, status: Number(!statusNum) },
          callback: () => {
            onClose();
            childRef.current.fetchGetData();
          },
        });
      },
    });
  };

  // 弹出窗属性
  const modalProps = {
    title: '用户详情',
    visible: shwo,
    onClose,
    bodyStyle: { paddingTop: 0 },
    footer: (
      <Button key="2" type="primary" onClick={handleUserStatus} loading={loading}>
        {statusText}
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="基础详情" key="1">
          <UserBaseDetail detail={detail}></UserBaseDetail>
        </Tabs.TabPane>
        <Tabs.TabPane tab="实名信息" key="2">
          <UserRealDetail detail={detail}></UserRealDetail>
        </Tabs.TabPane>
      </Tabs>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['withdrawDetail/fetchWithdrawSetRemark'],
}))(UserDetailShow);
