import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, InputNumber } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const GLobalSetDrawer = (props) => {
  const { dispatch, visible, onClose, loading, loadingData, getUpdate } = props;
  const { show = false, detail = {}, tabKey } = visible;
  const [form] = Form.useForm();

  // UCG提交表单
  const handleUpdataSava = () => {
    form.validateFields().then(async (values) => {
      if (tabKey === 'adVideo') {
        //視頻广告
        dispatch({
          type: 'videoAdvert/fetchVideoAdvertRootCountSet',
          payload: values,
          callback: () => {
            onClose();
            getUpdate(tabKey);
          },
        });
      } else if (['merchantVideo', 'jigsawAd'].includes(tabKey)) {
        //商家视频，拼图广告
        dispatch({
          type: 'puzzleAd/fetchPuzzleAdRootSet',
          payload: {
            ...detail,
            extraParam: values,
          },
          callback: () => {
            onClose();
            getUpdate(tabKey);
          },
        });
      } else if (tabKey === 'UGCVideo') {
        // UCG
        dispatch({
          type: 'videoPlatform/fetchUGCVideoBeanRulesSet',
          payload: {
            dictionaryId: '1417829187663585300',
            extraParam: JSON.stringify(values.beanRule),
          },
          payload2: {
            dictionaryId: '1417829187663585300',
            extraParam: JSON.stringify(values.rewardRule),
          },
          callback: () => {
            onClose();
            getUpdate(tabKey);
          },
        });
      } else if (tabKey === 'shareBean') {
        dispatch({
          type: 'videoAdvert/fetchVideoSetShareEarnBeanRule',
          payload: {
            dictionaryId: detail.dictionaryId,
            extraParam: JSON.stringify(values),
          },
          callback: () => {
            onClose();
            getUpdate(tabKey);
          },
        });
      }
    });
  };
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
      placeholder: '请输入视频数量',
    },
  ];

  const videoAdItem = [
    {
      label: '每看',
      name: 'count',
      suffix: '个视频弹出广告',
      placeholder: '请输入视频数量',
    },
  ];

  const UCGItems = [
    {
      title: 'UGC视频平台奖励卡豆规则',
      label: '每看',
      type: 'number',
      name: ['beanRule', 'second'],
      suffix: '秒视频',
      render: (val) => val + '秒视频',
    },
    {
      label: '获得',
      type: 'number',
      name: ['beanRule', 'bean'],
      suffix: '卡豆',
      render: (val) => val + '卡豆',
    },
    {
      label: '每日上限',
      type: 'number',
      name: ['beanRule', 'upperLimit'],
      suffix: '卡豆',
      render: (val) => val + '卡豆',
    },
    {
      title: 'UGC视频打赏规则',
      label: '每次打赏',
      type: 'number',
      name: ['rewardRule', 'bean'],
      suffix: '卡豆',
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
      suffix: '卡豆',
      name: ['totalLimit'],
      render: (val) => val + '卡豆',
      max: 999,
    },
    {
      label: '单个视频赚豆数',
      type: 'formItem',
      required: true,
      rules: 'false',
      formItem: (
        <>
          <Form.Item
            name="lowerLimit"
            rules={[{ required: true, message: '请输入单个视频赚豆数' }]}
            style={{ display: 'inline-block', width: 'calc(20%)' }}
          >
            <InputNumber min={0} placeholder={'请输入数字'} />
          </Form.Item>
          <span style={{ display: 'inline-block', margin: '5px 15px 0 19px' }}>-</span>
          <Form.Item
            name="upperLimit"
            rules={[{ required: true, message: '请输入单个视频赚豆数' }]}
            style={{ display: 'inline-block', width: 'calc(20%)' }}
          >
            <InputNumber min={0} placeholder={'请输入数字'} />
          </Form.Item>
          <span style={{ display: 'inline-block', margin: '5px 15px 0' }}>卡豆</span>
        </>
      ),
    },
  ];

  const goldVideoItem = [
    {
      label: '每看',
      type: 'number',
      min: 0,
      suffix: '秒视频',
      name: 'totalLimit',
    },
    {
      label: '获得',
      type: 'formItem',
      required: true,
      rules: 'false',
      formItem: (
        <>
          <Form.Item
            name="lowerLimit"
            rules={[{ required: true, message: '请输入获得金币数' }]}
            style={{ display: 'inline-block', marginBottom: 0 }}
          >
            <InputNumber min={0} placeholder={'请输入数字'} />
          </Form.Item>
          <span style={{ display: 'inline-block', margin: '5px 15px 0 19px' }}>-</span>
          <Form.Item
            name="upperLimit"
            rules={[{ required: true, message: '请输入获得金币数' }]}
            style={{ display: 'inline-block', marginBottom: 0 }}
          >
            <InputNumber min={0} placeholder={'请输入数字'} />
          </Form.Item>
          <span style={{ display: 'inline-block', margin: '5px 15px 0' }}>金币</span>
        </>
      ),
    },
    {
      label: '每日上限',
      min: 0,
      type: 'number',
      suffix: '金币',
      name: 'totalLismit',
    },
  ];

  const formItems = {
    merchantVideo: merChantItems,
    UGCVideo: UCGItems,
    adVideo: videoAdItem,
    shareBean: beanItem,
    goldVideo: goldVideoItem,
  }[tabKey];

  // 抽屉属性
  const modalProps = {
    title: '配置',
    visible: show,
    onClose,
    footer: (
      <>
        {
          <Button type="primary" onClick={handleUpdataSava} loading={loading}>
            保存
          </Button>
        }
      </>
    ),
  };

  return (
    <>
      <DrawerCondition {...modalProps}>
        <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
      </DrawerCondition>
    </>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['videoAdvert/fetchVideoAdvertRootCountSet'] ||
    loading.effects['puzzleAd/fetchPuzzleAdRootSet'] ||
    loading.effects['videoPlatform/fetchUGCVideoBeanRulesSet'],
}))(GLobalSetDrawer);
