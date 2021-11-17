import React from 'react';
import { connect } from 'umi';
import { Tabs, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import ExtraButton from '@/components/ExtraButton';
import FormCondition from '@/components/FormCondition';
import GoodsDetailForm from './Detail/GoodsDetail';

const CommerceGoodsDetail = (props) => {
  const { visible, onClose, onEdit, total, getDetail, loading } = props;
  const { show = false, index, detail = {}, status } = visible;

  const [form] = Form.useForm();

  const handleEdit = () => {
    onClose();
    onEdit();
  };

  const btnList = [
    {
      auth: 'edit',
      onClick: handleEdit,
      text: '编辑',
      show: ['1'].includes(status),
    },
  ];
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
    footer: <ExtraButton list={btnList}></ExtraButton>,
  };

  return (
    <DrawerCondition {...modalProps}>
      {/* 信息展示 */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="商品信息" key="1">
          <GoodsDetailForm detail={detail} form={form}></GoodsDetailForm>
        </Tabs.TabPane>
      </Tabs>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoods/fetchSpecialGoodsDetail'],
}))(CommerceGoodsDetail);
