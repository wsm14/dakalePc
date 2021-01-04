import React, { useState } from 'react';
import { connect } from 'umi';
import { Drawer, Button, Space, Form, Skeleton } from 'antd';
import AccountForm from './AccountForm/CorporateAccount';

const ProvAccountSet = (props) => {
  const {
    dispatch,
    visible = {},
    detail = {},
    setVisibleAct,
    setVisibleSet,
    loading,
    loadingDetail,
    companyId,
  } = props;

  const { type = 'add', show = false } = visible;

  const [form] = Form.useForm();
  // 骨架框显示
  const [skeletonType, setSkeletonType] = useState(true);

  // 提交数据
  const handleUpData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'provCompany/fetchProvBankSet',
        payload: { ownerId: companyId, ...values },
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
      onClose={closeDrawer}
      afterVisibleChange={(showEdit) => {
        if (showEdit) {
          setSkeletonType(false);
        } else {
          setSkeletonType(true);
        }
      }}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button onClick={closeDrawer}>取消</Button>
            <Button onClick={handleUpData} type="primary" loading={loading}>
              提交
            </Button>
          </Space>
        </div>
      }
    >
      <Skeleton loading={skeletonType || loadingDetail} active>
        <AccountForm form={form} type={type} detail={detail}></AccountForm>
      </Skeleton>
    </Drawer>
  );
};

export default connect(({ provCompany, loading }) => ({
  companyId: provCompany.companyId,
  loading: loading.effects['provCompany/fetchProvBankSet'],
}))(ProvAccountSet);
