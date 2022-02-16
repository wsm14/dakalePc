import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import PlatTag from './components/GoodTag/TagList/PlatTag';
import MerchantTag from './components/GoodTag/TagList/MerchantTag';
const tabList = [
  {
    key: 'platform',
    tab: '平台商品标签',
  },
  {
    key: 'merchant',
    tab: '店铺商品标签',
  },
];
const GoodsTag = (props) => {
  const [tabkey, setTabKey] = useState('platform');

  const listProps = { tabkey };

  const contentList = {
    platform: <PlatTag {...listProps}></PlatTag>,
    merchant: <MerchantTag {...listProps}></MerchantTag>,
  };

  return (
    <>
      <Card tabList={tabList} activeTabKey={tabkey} onTabChange={(key) => setTabKey(key)}>
        {contentList[tabkey]}
      </Card>
    </>
  );
};
export default GoodsTag;
