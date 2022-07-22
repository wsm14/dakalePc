import React, { useRef, useState, useEffect } from 'react';
import { Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import SpecialGoods from './SpecialGoods';
import CommerceGoods from './CommerceGoods';
import SeckillTimeActivityDrawer from './SeckillTimeActivityDrawer';

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
  const [selectItem, setSelectItem] = useState([]); // 当前选择项

  useEffect(() => {
    setSelectItem([]);
  }, [tabKey]);

  const btnList = [
    {
      auth: 'save',
      text: '新增',
      onClick: () => setVisible({ mode: 'add', show: true }),
    },
    {
      auth: 'batchEditRule',
      text: '批量设置规则',
      disabled: !selectItem.length,
      onClick: () => handleSetShow(selectItem),
    },
  ];

  const handleSetShow = (dataList) => setVisible({ mode: 'set', show: true, dataList });

  const listProps = { childRef, tabKey, setSelectItem, handleSetShow };

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
      <SeckillTimeActivityDrawer
        tabKey={tabKey}
        visible={visible}
        childRef={childRef}
        onClose={() => setVisible(false)}
      ></SeckillTimeActivityDrawer>
    </>
  );
};

export default SeckillTimeActivity;
