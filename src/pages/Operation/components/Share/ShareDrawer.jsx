import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form, Steps, Modal } from 'antd';
import uploadLive from '@/utils/uploadLive';
import DrawerCondition from '@/components/DrawerCondition';
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
  const [allowPush, setAllowPush] = useState(true); // 是否允许发布

  // 确认发布
  const handleVideoPush = () => {
    form.validateFields().then((values) => {
      Modal.confirm({
        title: '温馨提示',
        content: '发布分享所需的卡豆将从【商户钱包】中扣除，确认扣除卡豆并发布吗？',
        onOk: () => {
          const {
            frontImage,
            videoId,
            videoUrl,
            categoryNode = [],
            title,
            age,
            ageData,
            areaType,
            area,
            cityList = [],
            taste,
            tagsId = [],
          } = dataStorage;
          const { rewardStartTime: time, timedPublishTime: pTime } = values;
          const {
            free: { ownerCouponIdString: couponIds },
            contact = {},
          } = couponData;
          const { promotionType: cType } = contact;
          const { taste: tasteNodes } = extraData;
          let tasteData = {};
          if (taste === 'tag') {
            tasteData = {
              // 父级兴趣id，多个用逗号隔开
              topTagsId: Array.from(
                new Set(tasteNodes.map((item) => item.parentDomainIdStr)),
              ).toString(),
              // 父级兴趣名，多个用逗号隔开
              topTagsName: Array.from(
                new Set(tasteNodes.map((item) => item.parentDomainName)),
              ).toString(),
              // 子级兴趣id，多个豆号隔开
              tags: tasteNodes.map((item) => item.domainName).toString(),
              // 兴趣标签
              tagsId: tagsId.toString(),
            };
          }
          uploadLive({
            data: frontImage, // 上传封面
            callback: (imgs) => {
              uploadLive({
                data: videoId ? videoId : videoUrl, // 上传视频
                title,
                callback: (videos) => {
                  dispatch({
                    type: 'shareManage/fetchShareVideoPush',
                    payload: {
                      userType: 'merchant',
                      contentType: 'video',
                      scope: 'all',
                      merchantCount: 1,
                      beanFlag: '1', // 是否打赏 0 1
                      frontImageWidth: 544, // 封面宽
                      frontImageHeight: 960, // 封面长
                      ...values,
                      ...dataStorage,
                      ...tasteData,
                      videoUrl: undefined,
                      ageData: undefined,
                      cityList: undefined,
                      age: age === 'age' ? ageData.toString() : age,
                      area: {
                        all: undefined,
                        city: cityList.map((i) => i.city[i.city.length - 1]).toString(),
                        district: cityList.map((i) => i.city[i.city.length - 1]).toString(),
                        near: area,
                      }[areaType],
                      categoryNode: categoryNode.join('.'),
                      frontImage: imgs, // 封面连接
                      rewardStartTime: time && time[0].format('YYYY-MM-DD'),
                      rewardEndTime: time && time[1].format('YYYY-MM-DD'),
                      timedPublishTime: pTime && pTime.format('YYYY-MM-DD HH:mm:00'),
                      videoId: videos,
                      couponIds,
                      promotionId:
                        contact[{ coupon: 'ownerCouponIdString', goods: 'specialGoodsId' }[cType]],
                      promotionType: { coupon: 'reduce', goods: 'special' }[cType],
                    },
                    callback: () => {
                      onClose();
                      childRef.current.fetchGetData();
                    },
                  });
                },
              });
            },
          });
        },
      });
    });
  };

  useEffect(() => {
    fetchGetPropertyJSON();
    fetchGetTasteTag();
  }, []);

  // 商家id获取参数
  const getMerchantIdInfo = (merchantId) => {
    fetchShareGetPlatformBean(merchantId);
    fetchShareGetAccountBean(merchantId);
  };

  // 获取商家平台卡豆数
  const fetchShareGetPlatformBean = (merchantId) => {
    dispatch({
      type: 'shareManage/fetchShareGetPlatformBean',
      payload: {
        merchantId,
      },
    });
  };

  // 获取商家账户卡豆数
  const fetchShareGetAccountBean = (merchantId) => {
    dispatch({
      type: 'shareManage/fetchShareGetAccountBean',
      payload: {
        merchantId,
      },
    });
  };

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

  // 额外数据暂存
  const saveExtraStorage = (name, val) => {
    let data = val;
    if (name === 'city') data = [...extraData[name], data];
    setExtraData({ ...extraData, [name]: data });
  };

  // 公有 props
  const stepProps = { form, detail: dataStorage, saveDataStorage, getMerchantIdInfo };

  // 内容设置props
  const conentProps = { couponData, setCouponData };

  const steps = [
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
      content: <SharePushSet {...stepProps} setAllowPush={setAllowPush}></SharePushSet>,
    },
  ];

  const modalProps = {
    title: '发布分享',
    visible: show,
    width: 800,
    maskClosable: current === 0,
    onClose,
    closeCallBack: () => {
      dispatch({ type: 'shareManage/closeBean' });
      setCurrent(0);
      setAllowPush(true);
      setDataStorage({});
      setCouponData({ free: {}, contact: {} });
      setExtraData({ city: [], taste: [] });
    },
    footer: (
      <>
        {current > 0 && <Button onClick={() => handleNextStep('up')}>上一步</Button>}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => handleNextStep('next')}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleVideoPush} disabled={allowPush} loading={loading}>
            确认发布
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
  loading: loading.effects['shareManage/fetchShareVideoPush'],
}))(ShareDrawer);
