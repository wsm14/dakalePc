import React from 'react';
import { connect } from 'umi';
import { Card, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import ExtraButton from '@/components/ExtraButton';
import { groupGoods } from '@/components/VideoSelectBindContent/CouponFreeDom';
import GroupGoodModal from './GroupGoodModal';

const GroupGoodsDraw = (props) => {
  const {
    visible,
    onClose,
    goodList = [
      { name: '21', id: '2323' },
      { name: '12', id: '323' },
    ],
  } = props;
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
      //   onClick: () => setVisible({ show: true }),
    },
  ];

  const onDel = () => {};
  return (
    <>
      <DrawerCondition {...modalProps}>
        <Card title={<ExtraButton typeBtn={'link'} list={btnExtra}></ExtraButton>}>
          {goodList.map((item, index) => (
            <div style={{ margin: 5 }} key={index}>
              {groupGoods(item, '', '', onDel)}
            </div>
          ))}
        </Card>
      </DrawerCondition>
      <GroupGoodModal></GroupGoodModal>
    </>
  );
};
export default GroupGoodsDraw;
