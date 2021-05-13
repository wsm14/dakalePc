import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, Steps } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import ShareContentSet from './VideoSetForm/VideoContentSet';
import SharePushSet from './VideoSetForm/VideoPushSet';
import VideoNoviceDetail from './Detail/VideoNoviceDetail';

const { Step } = Steps;

const ShareDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'add', show = false, detail } = visible;

  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [dataStorage, setDataStorage] = useState({}); // 数据暂存
  const [couponData, setCouponData] = useState({ free: {}, contact: {} }); // 选择券的信息

  // 下一步
  const handleNextStep = () => {
    form.validateFields().then((values) => {
      saveDataStorage({ ...dataStorage, ...values });
      setCurrent(current + 1);
    });
  };

  // 暂存数据
  const saveDataStorage = (val) => setDataStorage({ ...dataStorage, ...val });

  // 公有 props
  const stepProps = { form, detail: dataStorage, saveDataStorage };

  // 内容设置props
  const conentProps = { couponData, setCouponData };

  const steps = [
    {
      title: '内容设置',
      content: <ShareContentSet {...stepProps} {...conentProps}></ShareContentSet>,
    },
    {
      title: '发布设置',
      content: <SharePushSet {...stepProps}></SharePushSet>,
    },
  ];

  const contentProps = {
    // 发布
    add: {
      title: '发布分享',
      // 展示内容
      children: (
        <>
          <div style={{ marginBottom: 24 }}>
            <Steps current={current} style={{ margin: '0 auto', width: 400 }}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
          </div>

          <div className="steps-content">{steps[current].content}</div>
        </>
      ),
      // 操作按钮
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
              确认发布
            </Button>
          )}
        </>
      ),
    },
    // 详情
    info: {
      title: '查看详情',
      children: <VideoNoviceDetail detail={detail}></VideoNoviceDetail>,
    },
  }[type];

  const modalProps = {
    title: contentProps.title,
    visible: show,
    width: 800,
    maskClosable: current === 0,
    onClose,
    closeCallBack: () => {
      setCurrent(0);
      setDataStorage({});
      setCouponData({ free: {}, contact: {} });
    },
    footer: contentProps.footer,
  };

  return <DrawerCondition {...modalProps}>{contentProps.children}</DrawerCondition>;
};

export default connect(({ loading }) => ({
  loading: loading.effects['goodsManage/fetchGoodsAdd'],
}))(ShareDrawer);
