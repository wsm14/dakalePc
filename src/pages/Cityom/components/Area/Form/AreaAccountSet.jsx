import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Drawer, Button, Space, Skeleton } from 'antd';
import AccountForm from './AccountForm/CorporateAccount';

const AreaAccountSet = (props) => {
  const {
    dispatch,
    visible = {},
    detail = {},
    setVisibleAct,
    setVisibleSet,
    loading,
    loadingDetail,
    partnerId,
  } = props;

  const { type = 'add', show = false } = visible;

  const cRef = useRef();
  // 骨架框显示
  const [skeletonType, setSkeletonType] = useState(true);

  // 提交数据
  const handleUpData = () => {
    cRef.current.fetchData().then((values) => {
      dispatch({
        type: 'areaCenter/fetchAreaBankSet',
        payload: { ownerId: partnerId, ...values },
        callback: () => {
          closeDrawer();
        },
      });
    });
  };

  const modalProps = {
    title: `${{ add: '绑定账户信息', edit: '编辑账户信息' }[type]}`,
    width: 700,
    visible: show,
    maskClosable: false,
    destroyOnClose: true,
  };

  const closeDrawer = () => {
    setSkeletonType(true);
    setVisibleAct(false);
    setVisibleSet(false);
  };

  return (
    <Drawer
      {...modalProps}
      onClose={() => {
        setSkeletonType(true);
        setVisibleAct(false);
      }}
      afterVisibleChange={(showEdit) => {
        if (showEdit) {
          setSkeletonType(false);
        } else {
          setSkeletonType(true);
        }
      }}
      destroyOnClose
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button
              onClick={() => {
                setSkeletonType(true);
                setVisibleAct(false);
              }}
            >
              取消
            </Button>
            <Button onClick={handleUpData} type="primary" loading={loading}>
              提交
            </Button>
          </Space>
        </div>
      }
    >
      <Skeleton loading={skeletonType || loadingDetail} active>
        <AccountForm cRef={cRef} type={type} detail={detail}></AccountForm>
      </Skeleton>
    </Drawer>
  );
};

export default connect(({ areaCenter, loading }) => ({
  partnerId: areaCenter.partnerId,
  loading: loading.effects['areaCenter/fetchAreaBankSet'],
}))(AreaAccountSet);
