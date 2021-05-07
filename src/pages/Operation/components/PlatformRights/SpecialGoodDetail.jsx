import React from 'react';
import { connect } from 'umi';
import { Button, Tabs } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import GoodsDetailForm from './Detail/GoodsDetail';
import RegularDetail from './Detail/RegularDetail';

const SpecialGoodDetail = (props) => {
  const { visible, onClose, onEdit, total, getDetail, loading } = props;
  const { show = false, index, detail = {}, status } = visible;

  const handleEdit = () => {
    onClose(), onEdit();
  };

  // 弹出窗属性
  const modalProps = {
    title: '活动详情',
    visible: show,
    loading,
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: status !== '0' && (
      <Button type="primary" onClick={handleEdit}>
        编辑
      </Button>
    ),
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

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsDetail'],
}))(SpecialGoodDetail);
