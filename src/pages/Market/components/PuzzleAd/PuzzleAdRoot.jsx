import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const PuzzleAdRoot = (props) => {
  const { visible, dispatch, onClose, loading, adRoot = {} } = props;
  const { data, dataValue } = adRoot;

  const [form] = Form.useForm();

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      dispatch({
        type: 'puzzleAd/fetchPuzzleAdRootSet',
        payload: {
          dictionaryDTOS: data.map((item) => ({ ...item, extraParam: values[item.child] })),
        },
        callback: onClose,
      });
    });
  };

  const formItems = [
    {
      label: '每日卡豆领取上限',
      name: 'dailyCardBeanCollectionLimit',
      suffix: '卡豆',
    },
    {
      label: '每看',
      name: 'watchVideosPopUpAdsNum',
      suffix: '个视频弹出广告',
      placeholder: '请输入视频数量',
    },
  ];

  const modalProps = {
    title: '编辑',
    visible: visible,
    onClose,
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={dataValue} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ puzzleAd, loading }) => ({
  adRoot: puzzleAd.adRoot,
  loading: loading.effects['puzzleAd/fetchPuzzleAdRootSet'],
}))(PuzzleAdRoot);
