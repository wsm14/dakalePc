import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, Alert } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';

const GroupActivate = (props) => {
  const { visible, onClose, dispatch, loading } = props;

  const { show, detail = {} } = visible;

  /**
   * bankStatus 激活状态
   * bankRejectReason 激活失败原因
   */
  const { bankStatus, bankRejectReason } = detail;

  const modalProps = {
    title: `激活账户信息`,
    visible: show,
    onClose,
    loading,
    footer: (
      <Button onClick={() => {}} type="primary">
        提交
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {bankStatus === '2' && bankRejectReason && (
        <Alert
          style={{ marginBottom: '12px' }}
          message={`失败原因：${bankRejectReason}`}
          type="error"
          showIcon
        />
      )}
      aaa
    </DrawerCondition>
  );
};

export default connect(({ groupSet, loading }) => ({
  list: groupSet.list.list,
  loading: loading.effects['groupSet/fetchGrounpDetails'],
  loadingBank: loading.effects['groupSet/fetchGroupSetBandCode'],
}))(GroupActivate);
