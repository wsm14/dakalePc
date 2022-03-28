import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, Steps } from 'antd';
import uploadLive from '@/utils/uploadLive';
import DrawerCondition from '@/components/DrawerCondition';
import ShareContentSet from './SharePushForm/ShareContentSet';
import SharePutInSet from './SharePushForm/SharePutInSet';
import SharePushSet from './SharePushForm/SharePushSet';

const { Step } = Steps;

const ShareDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { tabtype, show = false } = visible;

  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [dataStorage, setDataStorage] = useState({ userType: 'merchant' }); // 数据暂存
  const [couponData, setCouponData] = useState({ free: {}, contact: [] }); // 选择券的信息

  // 确认发布
  const handleVideoPush = () => {
    form.validateFields().then((values) => {
      const {
        age,
        title,
        tagsId = [],
        ageData,
        videoId,
        cityList = [],
        area,
        areaType,
        videoUrl,
        frontImage,
        categoryNode,
        ownerId,
        ...other
      } = dataStorage;
      const { free = {}, contact = [] } = couponData;
      const { publishTime, publishType } = values;
      // 券数据整理
      const newCoupon = [
        ...contact,
        ...(free.ownerCouponIdString ? [{ ...free, promotionType: 'free' }] : []),
      ];
      uploadLive({
        data: frontImage, // 上传封面
        callback: (imgs) => {
          uploadLive({
            data: videoId ? videoId : videoUrl, // 上传视频
            title,
            callback: (videos) => {
              dispatch({
                type: 'videoPlatform/fetchNewSharePush',
                payload: {
                  ...other,
                  scope: 'all',
                  title,
                  ownerId,
                  areaType,
                  publishType,
                  frontImageWidth: 544, // 封面宽
                  frontImageHeight: 960, // 封面长
                  frontImage: imgs, // 封面连接
                  videoId: videos,
                  tagsId: tagsId.toString(),
                  area: {
                    all: undefined,
                    city: cityList.map((i) => i.city[i.city.length - 1]).toString(),
                    district: cityList.map((i) => i.city[i.city.length - 1]).toString(),
                    near: area,
                  }[areaType],
                  momentRelateList: newCoupon.map((item) => ({
                    relateId:
                      item[
                        {
                          goods: 'specialGoodsId', // 特惠
                          free: 'ownerCouponIdString', // 免费
                          coupon: 'ownerCouponIdString', // 有价
                        }[item.promotionType]
                      ],
                    relateType: {
                      goods: 'specialGoods',
                      coupon: 'reduceCoupon',
                      free: 'freeReduceCoupon',
                    }[item.promotionType],
                    relateShardingKey: ownerId,
                  })),
                  age: age === 'age' ? ageData.toString() : age,
                  publishTime: publishTime && publishTime.format('YYYY-MM-DD HH:mm:00'),
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

  // 公有 props
  const stepProps = { tabtype, form, detail: dataStorage, saveDataStorage };

  // 内容设置props
  const conentProps = { couponData, setCouponData };

  const steps = [
    {
      title: '内容设置',
      content: <ShareContentSet {...stepProps} {...conentProps}></ShareContentSet>,
    },
    {
      title: '投放设置',
      content: <SharePutInSet {...stepProps}></SharePutInSet>,
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
    closeCallBack: () => {
      setCurrent(0);
      setDataStorage({});
      setCouponData({ free: {}, contact: [] });
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
          <Button type="primary" onClick={handleVideoPush} loading={loading}>
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
  loading: loading.effects['videoPlatform/fetchNewSharePush'],
}))(ShareDrawer);
