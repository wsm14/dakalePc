import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Modal, Tabs } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import GoodsDetailForm from './Form/GoodsDetailForm';
import RegularDetail from './Form/RegularDetail';

const SpecialGoodDetail = (props) => {
  const { visible, onClose } = props;
  const { show = false, detail = {} } = visible;

  // 弹出窗属性
  const modalProps = {
    title: '活动详情',
    visible: show,
    onClose,
    footer: <Button type="primary">编辑 </Button>,
  };

  return (
    <DrawerCondition {...modalProps}>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="商品信息" key="1">
          <GoodsDetailForm detail={detail}></GoodsDetailForm>
        </Tabs.TabPane>
        <Tabs.TabPane tab="投放规则" key="2">
          <RegularDetail detail={detail}></RegularDetail>
        </Tabs.TabPane>
      </Tabs>
    </DrawerCondition>
  );
};
export default SpecialGoodDetail;
