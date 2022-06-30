import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Tabs } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import UserBaseDetail from './Detail/UserBaseDetail';
import UserRealDetail from './Detail/UserRealDetail';
import PortClosure from './PortClosure';

const UserDetailShow = (props) => {
  const { visible, total, getDetail, childRef, onClose, loadingDetail } = props;

  const { show = false, index, detail = {} } = visible;
  const { userIdString } = detail;

  const [portVisible, setPortVisible] = useState(false);

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
      <>
        <Button
          type="primary"
          className="dkl_green_btn"
          onClick={() =>
            setPortVisible({
              show: true,
              detail: {
                ...detail,
                userId: userIdString,
              },
              type: 'enabled',
            })
          }
        >
          解封
        </Button>
        <Button
          type="primary"
          onClick={() =>
            setPortVisible({
              show: true,
              detail: {
                ...detail,
                userId: userIdString,
              },
              type: 'closure',
            })
          }
        >
          封停
        </Button>
      </>
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
}))(UserDetailShow);
