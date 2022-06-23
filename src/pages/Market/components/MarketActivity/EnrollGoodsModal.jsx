import React, { useState } from 'react';
import { Modal, Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import GoodsSelectModal from '@/components/GoodsSelectModal';
import EnrollSpecialGoods from './EnrollGoodsTable/EnrollSpecialGoods';
import EnrollCommerceGoods from './EnrollGoodsTable/EnrollCommerceGoods';

const tabList = [
  {
    key: 'specialGoods',
    tab: '特惠商品',
  },
  {
    key: 'commerceGoods',
    tab: '电商品',
  },
];

// 报名商品
const EnrollGoodsModal = (props) => {
  const { visible, onClose } = props;
  const { show = false, id, name } = visible;

  const [tabKey, setTabKey] = useState('specialGoods');
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  const btnList = [
    {
      text: '新增',
      onClick: () => setVisibleDrawer({ show: true, mode: 'add' }),
    },
  ];

  return (
    <>
      <Modal
        title={`报名商品 - ${name}`}
        width={1150}
        destroyOnClose
        footer={null}
        visible={show}
        zIndex={100}
        onCancel={onClose}
      >
        <Card
          tabList={tabList}
          activeTabKey={tabKey}
          onTabChange={setTabKey}
          tabBarExtraContent={<ExtraButton list={btnList}></ExtraButton>}
        >
          {tabKey === 'specialGoods' ? (
            // 特惠
            <EnrollSpecialGoods id={id}></EnrollSpecialGoods>
          ) : (
            // 电商
            <EnrollCommerceGoods id={id}></EnrollCommerceGoods>
          )}
        </Card>
      </Modal>
      {/* 商品选择页面 */}
      <GoodsSelectModal
        visible={visibleDrawer}
        showTag={[tabKey]}
        onSumbit={({ list }) => {
          fetchConfigGoodsSet(
            'add',
            list.map((i) => ({
              goodsId: i.goodsId,
              goodsType: i.activityType,
              ownerId: i.ownerId,
            })),
            () => setVisibleDrawer(false),
          );
        }}
        onClose={() => setVisibleDrawer(false)}
      ></GoodsSelectModal>
    </>
  );
};

export default EnrollGoodsModal;
