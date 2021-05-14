import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, Steps } from 'antd';
import aliOssUpload from '@/utils/aliOssUpload';
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

  // 确认发布
  const handleVideoPush = () => {
    form.validateFields().then((values) => {
      const {
        frontImage,
        videoContentOb: { url },
        categoryNode,
        title,
      } = dataStorage;
      const { areaType, area, rewardStartTime: time } = values;
      aliOssUpload(frontImage).then((imgRes) => {
        aliOssUpload(url, { type: 'video', params: { title } }).then((res) => {
          console.log(res);
          //   dispatch({
          //     type: 'videoAdvert/fetchVideoAdNoviceSet',
          //     payload: {
          //       userType: 'merchant',
          //       contentType: 'video',
          //       beanFlag: '1', // 是否打赏 0 1
          //       ...values,
          //       area: areaType === 'district' ? area[2] : undefined,
          //       categoryNode: categoryNode.join('.'),
          //       frontImage: imgRes.toString(), // 封面连接
          //       frontImageWidth: 544, // 封面宽
          //       frontImageHeight: 960, // 封面长
          //       rewardStartTime: time && time[0].format('YYYY-MM-DD'),
          //       rewardEndTime: time && time[1].format('YYYY-MM-DD'),
          //       videoContentOb: {
          //         ...dataStorage['videoContentOb'],
          //         url: res.toString(),
          //       },
          //     },
          //     callback: () => {
          //       onClose();
          //       childRef.current.fetchGetData();
          //     },
          //   });
        });
      });
    });
  };

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
            <Button type="primary" onClick={handleVideoPush} loading={loading}>
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
  loading: loading.effects['videoAdvert/fetchVideoAdNoviceSet'],
}))(ShareDrawer);
