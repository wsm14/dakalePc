import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

function UGCDrawer(props) {
  const { dispatch, visible, onClose, loading, loadingData } = props;
  const { show = false } = visible;

  const [form] = Form.useForm();
  const [rule, setRule] = useState({});

  const fetchGetData = () => {
    dispatch({
      type: 'videoPlatform/fetchUGCVideoBeanRules',
      callback: setRule,
    });
  };

  const formItems1 = [
    {
      title: 'UGC视频平台奖励卡豆规则',
      label: '每看',
      type: 'number',
      name: ['beanRule', 'second'],
      suffix: '秒视频',
      // rules: [{ required: false }],
    },
    {
      label: '获得',
      type: 'number',
      name: ['beanRule', 'bean'],
      suffix: '卡豆',
      // rules: [{ required: false }],
    },
    {
      label: '每日上限',
      type: 'number',
      name: ['beanRule', 'upperLimit'],
      suffix: '卡豆',
      // rules: [{ required: false }],
    },
    {
      title: 'UGC视频打赏规则',
      label: '每次打赏',
      type: 'number',
      name: ['rewardRule', 'bean'],
      suffix: '卡豆',
      // rules: [{ required: false }],
    },
    {
      label: '最多打赏',
      type: 'number',
      name: ['rewardRule', 'times'],
      suffix: '次',
      // rules: [{ required: false }],
    },
  ];
  // 提交表单
  const handleUpdataSava = () => {
    console.log(1);
    form.validateFields().then(async (values) => {
      console.log(values, 'values');
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
        },
      });
    });
  };
  // 抽屉属性
  const modalProps = {
    title: '配置',
    visible: show,
    width: 800,
    loading: loadingData,
    onClose,
    afterCallBack: () => {
      fetchGetData();
    },
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
        <FormCondition form={form} formItems={formItems1} initialValues={rule}></FormCondition>
      </DrawerCondition>
    </>
  );
}

export default connect(({ loading }) => ({
  loadingData: loading.effects['videoPlatform/fetchUGCVideoBeanRules'],
  loading:
    loading.effects['videoPlatform/fetchGetList'] ||
    loading.effects['videoPlatform/fetchNewShareDetail'] ||
    loading.effects['videoPlatform/fetchUGCVideoBeanRulesSet'],
}))(UGCDrawer);
