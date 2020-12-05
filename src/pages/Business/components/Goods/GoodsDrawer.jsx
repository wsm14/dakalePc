import React, { useState } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Space } from 'antd';
import GoodsDetail from './Detail/GoodsDetail';

const GoodsDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = '', detail = [] } = visible;

  const modalProps = {
    title: `${type == 'showDetail' ? '商品详情' : '审核'}`,
    width: 700,
    visible: type == 'showDetail',
    maskClosable: true,
    destroyOnClose: true,
  };

  return (
    <Drawer
      {...modalProps}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div style={{ textAlign: 'center' }}>
          <Space>
            <Button onClick={onClose}>取消</Button>
            {type != 'showDetail' && (
              <Button onClick={() => setVisibleRefuse(true)} type="primary">
                审核拒绝
              </Button>
            )}
          </Space>
        </div>
      }
    >
      <GoodsDetail detail={detail}></GoodsDetail>
    </Drawer>
  );
};

export default connect(({ tarinManage, loading }) => ({
  tarinManage,
  loading: loading.effects['verifyMerAllocation/fetchMreActionAudited'],
}))(GoodsDrawer);
