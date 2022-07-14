import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import GLobalSetDetail from './Form/GLobalSetDetail';
import GLobalSetDrawer from './Form/GLobalSetDrawer';

const tabList = [
  {
    key: 'merchantVideo',
    tab: '商家视频',
  },
  {
    key: 'UGCVideo',
    tab: 'UGC视频',
  },
  {
    key: 'adVideo',
    tab: '广告视频',
  },
  {
    key: 'goldVideo',
    tab: '金币视频',
  },
  {
    key: 'shareBean',
    tab: '分享赚豆',
  },
];

const VideoConfig = (props) => {
  const { dispatch, loading } = props;

  const [tabKey, setTabKey] = useState('merchantVideo');

  const [detail, setDetail] = useState({});
  const [visibleSet, setVisibleSet] = useState(false);

  useEffect(() => {
    fetchDetail(tabKey);
  }, [tabKey]);

  //UCG
  const fetchUCGGetData = () => {
    dispatch({
      type: 'videoPlatform/fetchUGCVideoBeanRules',
      callback: setDetail,
    });
  };

  // 获取拼图广告配置详情 商家视频
  const fetchAdRootDetail = () => {
    dispatch({
      type: 'puzzleAd/fetchPuzzleAdRoot',
      callback: (data) => {
        setDetail({ ...data?.data, ...data?.dataValue });
      },
    });
  };

  // 获取视频广告配置详情
  const fetchVideoAdvertRootCount = () => {
    dispatch({
      type: 'videoAdvert/fetchVideoAdvertRootCount',
      callback: (data) => {
        setDetail(data);
      },
    });
  };

  // 获取视频广告分享赚豆
  const fetchVideoGetDictionaryAdmin = () => {
    dispatch({
      type: 'videoAdvert/fetchVideoGetDictionaryAdmin',
      payload: { parent: 'shareEarnBean', child: 'shareMoment' },
      callback: (data) => {
        setDetail(data);
      },
    });
  };

  const fetchDetail = (type) => {
    switch (type) {
      case 'merchantVideo':
        fetchAdRootDetail();
        break;
      case 'adVideo':
        fetchVideoAdvertRootCount();
        break;
      case 'UGCVideo':
        fetchUCGGetData();
        break;
      case 'shareBean':
        fetchVideoGetDictionaryAdmin();
        break;
    }
  };

  const listProps = { tabKey, detail };

  const contentList = {
    merchantVideo: <GLobalSetDetail {...listProps}></GLobalSetDetail>,
    UGCVideo: <GLobalSetDetail {...listProps}></GLobalSetDetail>,
    adVideo: <GLobalSetDetail {...listProps}></GLobalSetDetail>,
    shareBean: <GLobalSetDetail {...listProps}></GLobalSetDetail>,
    goldVideo: <GLobalSetDetail {...listProps}></GLobalSetDetail>,
  };

  const handleUpdateSet = () => {
    setVisibleSet({
      show: true,
      detail,
      tabKey,
    });
  };

  const cardBtnList = [
    {
      text: '编辑',
      auth: `${tabKey}_edit`,
      onClick: handleUpdateSet,
    },
  ];

  return (
    <>
      <Card
        loading={loading}
        tabList={tabList}
        activeTabKey={tabKey}
        onTabChange={(key) => setTabKey(key)}
        tabBarExtraContent={<ExtraButton list={cardBtnList}></ExtraButton>}
      >
        {contentList[tabKey]}
      </Card>
      {/* 编辑 */}
      <GLobalSetDrawer
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
        getUpdate={fetchDetail}
      ></GLobalSetDrawer>
    </>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['puzzleAd/fetchPuzzleAdRoot'] ||
    loading.effects['videoPlatform/fetchUGCVideoBeanRules'] ||
    loading.effects['videoAdvert/fetchVideoAdvertRootCount'] ||
    loading.effects['videoAdvert/fetchVideoGetDictionaryAdmin'],
}))(VideoConfig);
