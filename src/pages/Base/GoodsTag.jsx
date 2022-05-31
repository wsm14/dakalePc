import React, { useRef, useState } from 'react';
import { Card } from 'antd';
import { TAG_TYPE } from '@/common/constant';
import ExtraButton from '@/components/ExtraButton';
import TagSet from './components/GoodTag/Form/TagSet';
import PlatTag from './components/GoodTag/List/PlatTag';
import ShowTag from './components/GoodTag/List/ShowTag';

const GoodsTag = () => {
  const [tabkey, setTabKey] = useState('platform');
  const [visible, setVisible] = useState(false); // 修改新增框

  const childRef = useRef();

  const listProps = { tabkey, childRef, setVisible };

  const contentList = {
    platform: <PlatTag {...listProps}></PlatTag>,
    show: <ShowTag {...listProps}></ShowTag>,
  };

  const extraBtn = [
    {
      text: '新增标签',
      auth: 'save',
      onClick: () => setVisible({ mode: 'add', detail: { tagType: tabkey } }),
    },
  ];

  return (
    <>
      <Card
        tabList={Object.keys(TAG_TYPE).map((key) => ({ key, tab: TAG_TYPE[key] }))}
        activeTabKey={tabkey}
        tabBarExtraContent={<ExtraButton list={extraBtn}></ExtraButton>}
        onTabChange={(key) => setTabKey(key)}
      >
        {contentList[tabkey]}
      </Card>
      <TagSet cRef={childRef} visible={visible} onClose={() => setVisible(false)}></TagSet>
    </>
  );
};
export default GoodsTag;
