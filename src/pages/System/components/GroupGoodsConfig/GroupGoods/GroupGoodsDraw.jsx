import React, { useState } from 'react';
import { connect } from 'umi';
import { Card, Button } from 'antd';
import DndDragContext from '@/components/DndDragContext';
import DrawerCondition from '@/components/DrawerCondition';
import ExtraButton from '@/components/ExtraButton';
import { groupGoods } from '@/components/VideoSelectBindContent/CouponFreeDom';
import GroupGoodModal from './GroupGoodModal';

const GroupGoodsDraw = (props) => {
  const {
    visible,
    onClose,
    goodList = [
      { name: '11', id: '1' },
      { name: '32232', id: '2' },
    ],
  } = props;
  const [visibleModal, setVisibleModal] = useState(false);
  const [list, setList] = useState([...goodList]);

  const modalProps = {
    title: '编辑',
    visible: visible,
    width: 960,
    onClose,
    footer: <Button type="primary">保存</Button>,
  };

  const btnExtra = [
    {
      text: '+新增商品',
      auth: 'groupGoodsConfigAdd',
      onClick: () => setVisibleModal({ show: true }),
    },
  ];

  const onDel = () => {};
  const onEnd = (data) => {
    console.log(data, 'list');
    setList(data);
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        <Card title={<ExtraButton typeBtn={'link'} list={btnExtra}></ExtraButton>}>
          <DndDragContext accept="Card" data={list} onEnd={onEnd} >
            {list.map((item, index) => groupGoods(item, '', '', onDel))}
          </DndDragContext>
        </Card>
      </DrawerCondition>
      <GroupGoodModal
        visible={visibleModal}
        onClose={() => setVisibleModal(false)}
      ></GroupGoodModal>
    </>
  );
};
export default GroupGoodsDraw;
