import React, { useState } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import { groupGoods } from '@/components/VideoSelectBindContent/CouponFreeDom';
import GroupGoodsDraw from './GroupGoods/GroupGoodsDraw';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const GroupGoodsConfig = (props) => {
  const { goodList = [{ name: '21' }, { name: '12' }] } = props;
  const [visible, setVisible] = useState(false);

  const btnExtra = [
    {
      text: '编辑',
      auth: 'groupGoodsConfigEdit',
      onClick: () => setVisible({ show: true }),
    },
  ];
  const onDel = () => {};

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <Card title="拼团商品配置" extra={<ExtraButton list={btnExtra}></ExtraButton>}>
          <div style={{ display: 'flex' }}>
            {goodList.map((item, index) => (
              <div style={{ margin: 5 }} key={index}>
                {groupGoods(item)}
              </div>
            ))}
          </div>
        </Card>
        <GroupGoodsDraw visible={visible} onClose={() => setVisible(false)}></GroupGoodsDraw>
      </DndProvider>
    </>
  );
};
export default GroupGoodsConfig;
