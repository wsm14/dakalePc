import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Modal, Tabs } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import UserBaseDetail from './Detail/UserBaseDetail';
import UserRealDetail from './Detail/UserRealDetail';
import PortClosure from './PortClosure';

const UserDetailShow = (props) => {
  const { dispatch, visible, total, getDetail, childRef, onClose, loading, loadingDetail } = props;

  const { show = false, index, detail = {} } = visible;
  const { status, userIdString } = detail;

  const [portVisible, setPortVisible] = useState(false);

  const statusNum = Number(status);
  const statusText = !statusNum ? '启用' : '封停';

  // 账户状态
  // const handleUserStatus = () => {
  //   Modal.confirm({
  //     title: `确认${statusText}该账户`,
  //     okText: '确认',
  //     cancelText: '取消',
  //     onOk: () => {
  //       dispatch({
  //         type: 'userList/fetchUserStatus',
  //         payload: { userId: userIdString, status: Number(!statusNum) },
  //         callback: () => {
  //           onClose();
  //           childRef.current.fetchGetData();
  //         },
  //       });
  //     },
  //   });
  // };

  // 弹出窗属性
  const modalProps = {
    title: '用户详情',
    visible: show,
    onClose,
    bodyStyle: { paddingTop: 0 },
    loading: loadingDetail,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size),
    },
    footer: (
      // <Button key="2" type="primary" onClick={handleUserStatus} loading={loading}>
      // {statusText}
      // </Button>
      <Button
        key="2"
        type="primary"
        onClick={() =>
          setPortVisible({
            show: true,
            detail: {
              ...detail,
              userId: userIdString,
            },
          })
        }
      >
        封停
      </Button>
    ),
  };

  return (
    <>
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
      <PortClosure
        childRef={childRef}
        visible={portVisible}
        onCloseDetail={() => onClose()}
        onClose={() => setPortVisible(false)}
      ></PortClosure>
    </>
  );
};

export default connect(({ loading }) => ({
  loadingDetail: loading.effects['userList/fetchUserDetail'],
  loading: loading.effects['withdrawDetail/fetchWithdrawSetRemark'],
}))(UserDetailShow);
