import React, { useRef } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import AccountForm from './AccountForm/CorporateAccount';
import DrawerCondition from '@/components/DrawerCondition';

const ProvAccountSet = (props) => {
  const {
    dispatch,
    visible = {},
    detail = {},
    setVisibleAct,
    setVisibleSet,
    loading,
    companyId,
  } = props;

  const { type = 'add', show = false } = visible;

  const cRef = useRef();

  // 提交数据
  const handleUpData = () => {
    cRef.current.fetchData().then((values) => {
      dispatch({
        type: 'provCompany/fetchProvBankSet',
        payload: { ownerId: companyId, ...values },
        callback: () => {
          closeDrawer();
        },
      });
    });
  };

  // 关闭
  const closeDrawer = () => {
    setVisibleAct(false);
    setVisibleSet(false);
  };

  const modalProps = {
    title: `${{ add: '绑定账户信息', edit: '编辑账户信息' }[type]}`,
    visible: show,
    maskClosable: false,
    destroyOnClose: true,
    onClose: closeDrawer,
    footer: (
      <Button onClick={handleUpData} type="primary" loading={loading}>
        提交
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <AccountForm cRef={cRef} type={type} detail={detail}></AccountForm>
    </DrawerCondition>
  );
};

export default connect(({ provCompany, loading }) => ({
  companyId: provCompany.companyId,
  loading: loading.effects['provCompany/fetchProvBankSet'],
}))(ProvAccountSet);
