import React, { useState } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const GLobalSetDetail = (props) => {
  const { dispatch, loading, tabKey, detail = {} } = props;

  const merChantItems = [
    {
      label: '每日卡豆领取上限',
      name: 'beanLimit',
      suffix: '卡豆',
      render: (val) => val + '卡豆',
    },
    {
      label: '每看',
      name: 'preventSize',
      suffix: '个视频弹出广告',
      render: (val) => val + '个视频弹出广告',
    },
  ];

  const videoAdItem = [
    {
      label: '每看',
      name: 'count',
      suffix: '个视频弹出广告',
      render: (val) => val + '个视频弹出广告',
    },
  ];

  const UCGItems = [
    {
      label: '每看',
      type: 'number',
      name: ['beanRule', 'second'],
      suffix: '秒视频',
      render: (val, row) => {
        const { beanRule = {} } = row;
        return `${val}秒视频获得${beanRule.bean}卡豆`;
      },
    },
    {
      label: '每日上限',
      type: 'number',
      name: ['beanRule', 'upperLimit'],
      render: (val) => val + '卡豆',
    },
  ];
  const UGCItems2 = [
    {
      title: 'UGC视频打赏规则',
      label: '每次打赏',
      type: 'number',
      name: ['rewardRule', 'bean'],
      render: (val) => val + '卡豆',
    },
    {
      label: '最多打赏',
      type: 'number',
      name: ['rewardRule', 'times'],
      suffix: '次',
      extra: '指每个人每天对单个视频最多打赏几次。',
      render: (val) => val + '次',
    },
  ];

  const beanItem = [
    {
      label: '每日赚豆上限',
      type: 'number',
      name: ['totalLimit'],
      render: (val) => val + '卡豆',
    },
    {
      label: '单个视频赚豆数',
      type: 'formItem',
      render: (val, row) => `${row?.lowerLimit}-${row?.upperLimit}卡豆`,
    },
  ];

  const formItems = {
    merchantVideo: merChantItems,
    UGCVideo: UCGItems,
    adVideo: videoAdItem,
    shareBean: beanItem,
    // jigsawAd: videoAdItem,
  }[tabKey];

  return (
    <>
      {tabKey === 'UGCVideo' ? (
        <>
          <DescriptionsCondition
            title={'UGC视频平台奖励卡豆规则'}
            formItems={formItems}
            initialValues={detail}
          ></DescriptionsCondition>
          <DescriptionsCondition
            title={'UGC视频打赏规则'}
            formItems={UGCItems2}
            initialValues={detail}
          ></DescriptionsCondition>
        </>
      ) : (
        <DescriptionsCondition formItems={formItems} initialValues={detail}></DescriptionsCondition>
      )}
    </>
  );
};

export default GLobalSetDetail;
