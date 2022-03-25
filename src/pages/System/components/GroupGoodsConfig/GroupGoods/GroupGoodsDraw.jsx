import React from 'react';
import { connect } from 'umi';
import { Card, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import ExtraButton from '@/components/ExtraButton';

const GroupGoodsDraw = (props) => {
  const { visible, onClose } = props;
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
  return (
    <DrawerCondition {...modalProps}>
      <Card title={<ExtraButton typeBtn={'link'} list={btnExtra}></ExtraButton>}></Card>
    </DrawerCondition>
  );
};
export default GroupGoodsDraw;
