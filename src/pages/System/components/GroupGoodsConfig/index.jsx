import React, { useState } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import { groupGoods } from '@/components/VideoSelectBindContent/CouponFreeDom';
import GroupGoodsDraw from './GroupGoods/GroupGoodsDraw'

const GroupGoodsConfig = (props) => {
  const { goodList = [] } = props;
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
      <Card title="拼团商品配置" extra={<ExtraButton list={btnExtra}></ExtraButton>}>
        <div style={{ margin: '5px' }}>
          {goodList.map((item) => groupGoods(item, '', '', onDel))}
        </div>
      </Card>
      <GroupGoodsDraw visible={visible} onClose={()=>setVisible(false)}></GroupGoodsDraw>
    </>
  );
};
export default GroupGoodsConfig;
