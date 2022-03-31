import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';

const PreviewDrawer = (props) => {
  const { visible, onClose, loading, detail = {} } = props;

  // 弹窗属性
  const modalProps = {
    title: '预览',
    visible,
    onClose,
    loading,
  };

  return (
    <DrawerCondition {...modalProps}>
      <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
        <img src={detail.image} alt="" style={{ width: 330 }} />
      </div>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['walkingManage/fetchGetResourceTemplateById'],
}))(PreviewDrawer);
