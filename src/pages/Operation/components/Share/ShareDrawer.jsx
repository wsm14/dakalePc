import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form, Steps } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import ShareMreSelect from './SharePushForm/ShareMreSelect';
import ShareContentSet from './SharePushForm/ShareContentSet';
import SharePutInSet from './SharePushForm/SharePutInSet';
import SharePushSet from './SharePushForm/SharePushSet';

const { Step } = Steps;

const ShareDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'add', show = false } = visible;
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [dataStorage, setDataStorage] = useState({ userType: 'merchant' }); // 数据暂存
  const [couponData, setCouponData] = useState({ free: {}, contact: {} }); // 选择券的信息
  const [extraData, setExtraData] = useState({ city: [], taste: [] }); // 额外数据暂存 city 地域 taste 兴趣

  useEffect(() => {
    fetchGetPropertyJSON();
    fetchGetTasteTag();
  }, []);

  // 获取配置文件
  const fetchGetPropertyJSON = () => {
    dispatch({
      type: 'baseData/fetchGetPropertyJSON',
    });
  };

  // 获取兴趣标签
  const fetchGetTasteTag = () => {
    dispatch({
      type: 'baseData/fetchGetTasteTag',
    });
  };

  // 下一步
  const handleNextStep = () => {
    form.validateFields().then((values) => {
      console.log(values);
      saveDataStorage({ ...dataStorage, ...values });
      setCurrent(current + 1);
    });
  };

  // 暂存数据
  const saveDataStorage = (val) => setDataStorage({ ...dataStorage, ...val });

  // 额外数据暂存
  const saveExtraStorage = (name, val) => {
    let data = val;
    if (name === 'city') data = [...extraData[name], data];
    setExtraData({ ...extraData, [name]: data });
  };

  // 公有 props
  const stepProps = { form, detail: dataStorage, saveDataStorage };

  // 内容设置props
  const conentProps = { couponData, setCouponData };

  const steps = [
    {
      title: '选择店铺',
      content: <ShareMreSelect {...stepProps}></ShareMreSelect>,
    },
    {
      title: '内容设置',
      content: <ShareContentSet {...stepProps} {...conentProps}></ShareContentSet>,
    },
    {
      title: '投放设置',
      content: <SharePutInSet {...stepProps} saveExtraStorage={saveExtraStorage}></SharePutInSet>,
    },
    {
      title: '发布设置',
      content: <SharePushSet {...stepProps}></SharePushSet>,
    },
  ];

  const modalProps = {
    title: '发布分享',
    visible: show,
    width: 800,
    maskClosable: current === 0,
    onClose,
    footer: (
      <>
        {current > 0 && <Button onClick={() => setCurrent(current - 1)}>上一步</Button>}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={handleNextStep}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => 'Processing complete!'}>
            Done
          </Button>
        )}
      </>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <Steps current={current} style={{ marginBottom: 20 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['goodsManage/fetchGoodsAdd'],
}))(ShareDrawer);
