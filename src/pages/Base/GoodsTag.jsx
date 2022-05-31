import React, { useRef, useState } from 'react';
import { Card } from 'antd';
import { TAG_TYPE } from '@/common/constant';
import ExtraButton from '@/components/ExtraButton';
import TagSetDrawer from './components/GoodTag/Form/TagSetDrawer';
import PlatTagList from './components/GoodTag/PlatTagList';
import ShowTagList from './components/GoodTag/ShowTagList';

const GoodsTag = () => {
  const [tabkey, setTabKey] = useState('platform');
  const [visible, setVisible] = useState(false); // 修改新增框

  const childRef = useRef();

  const listProps = { tabkey, childRef, setVisible };

  const contentList = {
    platform: <PlatTagList {...listProps} />,
    show: <ShowTagList {...listProps} />,
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
      <TagSetDrawer
        cRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></TagSetDrawer>
    </>
  );
};
export default GoodsTag;
