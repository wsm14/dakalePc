import React, { useState } from 'react';
import { connect } from 'umi';
import { Card, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import ExtraButton from '@/components/ExtraButton';
// import { groupGoods } from '@/components/VideoSelectBindContent/CouponFreeDom';
import { groupGoods } from './GroupGoods';
import GroupGoodModal from './GroupGoodModal';
import DndDragContext from '@/components/DndDragContext'

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
    setList(data);
  };

  return (
    <>
        <DrawerCondition {...modalProps}>
          <Card title={<ExtraButton typeBtn={'link'} list={btnExtra}></ExtraButton>}>
            {list.map((item, index) => (
              <div style={{ margin: 5 }} key={index}>
                {groupGoods(item, '', '', onDel, index, item.id, list, onEnd)}
              </div>
            ))}
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
