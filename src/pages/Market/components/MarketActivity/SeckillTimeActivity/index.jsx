import React, { useRef, useState } from 'react';
import { Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import CommerceGoods from './CommerceGoods';
import SpecialGoods from './SpecialGoods';

const tabList = [
  {
    key: 'commerceGoods',
    tab: '电商品',
  },
  {
    key: 'specialGoods',
    tab: '特惠商品',
  },
];

const SeckillTimeActivity = () => {
  const childRef = useRef();
  const [visible, setVisible] = useState(false);
  const [tabKey, setTabKey] = useState('commerceGoods');
  const [visibleGoods, setVisibleGoods] = useState(false);

  const btnList = [
    {
      auth: 'save',
      text: '新增',
      onClick: () => setVisible({ mode: 'add', show: true }),
    },
    {
      auth: 'batchEditRule',
      text: '批量设置规则',
      onClick: () => setVisible({ mode: 'add', show: true }),
    },
  ];

  const listProps = { tabKey: tabKey };

  const contentList = {
    commerceGoods: <CommerceGoods {...listProps}></CommerceGoods>,
    specialGoods: <SpecialGoods {...listProps}></SpecialGoods>,
  };

  return (
    <>
      <Card
        tabList={tabList}
        bordered={false}
        activeTabKey={tabKey}
        onTabChange={(key) => setTabKey(key)}
        tabBarExtraContent={<ExtraButton list={btnList}></ExtraButton>}
      >
        {contentList[tabKey]}
      </Card>
    </>
  );
};

export default SeckillTimeActivity;
