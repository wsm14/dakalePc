import React from 'react';
import { connect } from 'umi';
import { Card, Button } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import ExtraButton from '@/components/ExtraButton';
import { groupGoods } from './GroupGoods';


const GroupGoodsDraw = (props) => {
  const { visible, onClose, goodList = [{ name: '21' }, { name: '12' }] } = props;
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
      <Card title={<ExtraButton typeBtn={'link'} list={btnExtra}></ExtraButton>}>
      
          {goodList.map((item, index) => (
            <div style={{ margin: 5 }} key={index}>
              {groupGoods(item, '', '', '',index, item.id, goodList)}
            </div>
          ))}
        
      </Card>
    </DrawerCondition>
  );
};
export default GroupGoodsDraw;
