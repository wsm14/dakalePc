import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, Steps } from 'antd';
import uploadLive from '@/utils/uploadLive';
import aliOssUpload from '@/utils/aliOssUpload';
import DrawerCondition from '@/components/DrawerCondition';
import ShareContentSet from './VideoSetForm/VideoContentSet';
import SharePushSet from './VideoSetForm/VideoPushSet';
import VideoNoviceDetail from './Detail/VideoNoviceDetail';

const { Step } = Steps;

const ShareDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'add', show = false, detail = {} } = visible;

  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [dataStorage, setDataStorage] = useState({ userType: 'merchant' }); // 数据暂存
  const [couponData, setCouponData] = useState({ free: {}, contact: {} }); // 选择券的信息

  // 确认发布
  const handleVideoPush = () => {
    form.validateFields().then((values) => {
      const { frontImage, videoId, videoUrl, categoryNode, title } = dataStorage;
      const { areaType, area, rewardStartTime: time, friendShareImg, ...ohter } = values;
      const {
        free: { ownerCouponIdString: couponIds },
        contact = {},
      } = couponData;
      const { promotionType: cType } = contact;
      uploadLive({
        data: frontImage, // 上传封面
        callback: (imgs) => {
          uploadLive({
            data: videoId ? videoId : videoUrl, // 上传视频
            title,
            callback: (videos) => {
              aliOssUpload(friendShareImg).then((res) => {
                dispatch({
                  type: 'noviceAdvert/fetchVideoAdNoviceSet',
                  payload: {
                    userType: 'merchant',
                    contentType: 'video',
                    beanFlag: '1', // 是否打赏 0 1
                    ...dataStorage,
                    ...ohter,
                    areaType,
                    friendShareImg: res.toString(),
                    videoUrl: undefined,
                    area: areaType === 'district' ? area[2] : undefined,
                    categoryNode: categoryNode.join('.'),
                    frontImage: imgs, // 封面连接
                    frontImageWidth: 544, // 封面宽
                    frontImageHeight: 960, // 封面长
                    rewardStartTime: time && time[0].format('YYYY-MM-DD'),
                    rewardEndTime: time && time[1].format('YYYY-MM-DD'),
                    videoId: videos,
                    couponIds,
                    promotionIdStr:
                      contact[{ coupon: 'ownerCouponIdString', goods: 'specialGoodsId' }[cType]],
                    promotionType: { coupon: 'reduce', goods: 'special' }[cType],
                  },
                  callback: () => {
                    onClose();
                    childRef.current.fetchGetData();
                  },
                });
              });
            },
          });
        },
      });
    });
  };

  // 搜索店铺用于回显数据
  const fetchGetMre = () => {
    const { name } = detail;
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: { name },
    });
  };

  // 弹窗打开时处理数据方法
  const afterCallBack = () => {
    fetchGetMre();
    setDataStorage(detail);
    setCouponData({ free: detail.free || {}, contact: detail.contact || {} });
  };

  // 下一步
  const handleNextStep = (buttonType) => {
    if (buttonType === 'next') {
      form.validateFields().then((values) => {
        saveDataStorage({ ...dataStorage, ...values });
        setCurrent(current + 1);
      });
    } else {
      const data = form.getFieldsValue();
      saveDataStorage({ ...dataStorage, ...data });
      setCurrent(current - 1);
    }
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

  // 重新发 / 发布 dom
  const pushProps = {
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
        {current > 0 && <Button onClick={() => handleNextStep('up')}>上一步</Button>}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => handleNextStep('next')}>
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
  };

  const contentProps = {
    add: pushProps, // 发布
    again: pushProps, // 重新发布
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
    afterCallBack,
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
  loading: loading.effects['noviceAdvert/fetchVideoAdNoviceSet'],
}))(ShareDrawer);
