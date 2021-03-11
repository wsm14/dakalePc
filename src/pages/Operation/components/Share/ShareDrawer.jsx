import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, Steps } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';

const { Step } = Steps;

const steps = [
  {
    title: '选择店铺',
    content: 'First-content',
  },
  {
    title: '内容设置',
    content: 'Second-content',
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

const ShareDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'add', show = false, detail = [] } = visible;
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);

  const modalProps = {
    title: `${type == 'add' ? '发布分享' : '分享详情'}`,
    visible: show,
    width: type == 'add' ? 950 : 650,
    maskClosable: current === 0,
    onClose,
    footer: (
      <>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => setCurrent(current + 1)}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => 'Processing complete!'}>
            Done
          </Button>
        )}
        {current > 0 && <Button onClick={() => setCurrent(current - 1)}>Previous</Button>}
      </>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <Steps current={current}>
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
