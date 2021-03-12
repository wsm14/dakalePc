import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, Steps } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';
import ShareMreSelect from './SharePushForm/ShareMreSelect';
import ShareContentSet from './SharePushForm/ShareContentSet';

const { Step } = Steps;

const ShareDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'add', show = false, detail = {} } = visible;
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [dataStorage, setDataStorage] = useState({ userType: 'merchant' }); // 数据暂存
  const [couponData, setCouponData] = useState({ free: {}, contact: {} }); // 选择券的信息

  // 下一步
  const handleNextStep = () => {
    form.validateFields().then((values) => {
      console.log(values);
      saveDataStorage(values);
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
      title: '选择店铺',
      content: <ShareMreSelect {...stepProps}></ShareMreSelect>,
    },
    {
      title: '内容设置',
      content: <ShareContentSet {...stepProps} {...conentProps}></ShareContentSet>,
    },
    {
      title: '投放设置',
      content: 'Last-content',
    },
    {
      title: '发布设置',
      content: 'Last-content',
    },
    {
      title: '发布',
      content: 'Last-content',
    },
  ];

  const modalProps = {
    title: `${type == 'add' ? '发布分享' : '分享详情'}`,
    visible: show,
    width: type == 'add' ? 950 : 650,
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
