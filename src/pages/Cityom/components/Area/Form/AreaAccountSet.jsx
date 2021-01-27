import React, { useRef } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import AccountForm from './AccountForm/CorporateAccount';
import DrawerCondition from '@/components/DrawerCondition';

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
    visible: show,
    loading: loadingDetail,
    footer: (
      <Button onClick={handleUpData} type="primary" loading={loading}>
        提交
      </Button>
    ),
  };

  const closeDrawer = () => {
    setVisibleAct(false);
    setVisibleSet(false);
  };

  return (
    <DrawerCondition {...modalProps} onClose={() => setVisibleAct(false)}>
      <AccountForm cRef={cRef} type={type} detail={detail}></AccountForm>
    </DrawerCondition>
  );
};

export default connect(({ areaCenter, loading }) => ({
  partnerId: areaCenter.partnerId,
  loading: loading.effects['areaCenter/fetchAreaBankSet'],
}))(AreaAccountSet);
