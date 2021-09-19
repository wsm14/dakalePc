import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form, Steps, notification } from 'antd';
import uploadLive from '@/utils/uploadLive';
import DrawerCondition from '@/components/DrawerCondition';
import ShareContentSet from './VideoSetForm/VideoContentSet';
import SharePutInSet from './VideoSetForm/VideoPutInSet';

const { Step } = Steps;

const ShareDrawer = (props) => {
  const { dispatch, visible, childRef, onClose, loading } = props;

  const { type = 'add', show = false } = visible;
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [dataStorage, setDataStorage] = useState({ relateType: 'merchant' }); // 数据暂存
  const [couponData, setCouponData] = useState({ free: {}, contact: [] }); // 选择券的信息

  // 确认发布
  const handleVideoPush = () => {
    form.validateFields().then((values) => {
      const { title, videoId, url, frontImage, relateId, ...other } = dataStorage;
      const {
        browseType,
        age,
        tagsId = [],
        ageData,
        cityList = [],
        area,
        areaType,
        ...otherValus
      } = values;
      const { free = {}, contact = [] } = couponData;
      let goodsList = {};
      if (dataStorage.relateType !== 'brand') {
        // 券数据整理
        const newCoupon = [
          ...contact,
          ...(free.ownerCouponIdString ? [{ ...free, promotionType: 'free' }] : []),
        ];
        goodsList = {
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
            relateShardingKey: relateId,
          })),
        };
      }

      uploadLive({
        data: frontImage, // 上传封面
        callback: (imgs) => {
          uploadLive({
            data: videoId ? videoId : url, // 上传视频
            title,
            callback: (videos) => {
              dispatch({
                type: 'videoAdvert/fetchVideoAdvertCreate',
                payload: {
                  ...other,
                  ...otherValus,
                  browseType: browseType == 'all' ? '' : browseType,
                  scope: 'all',
                  title,
                  relateId,
                  areaType,
                  frontImageWidth: 544, // 封面宽
                  frontImageHeight: 960, // 封面长
                  frontImage: imgs, // 封面连接
                  videoId: videos,
                  tagsId: tagsId.toString(),
                  age: age === 'age' ? ageData.toString() : age,
                  area: {
                    all: undefined,
                    city: cityList.map((i) => i.city[i.city.length - 1]).toString(),
                    district: cityList.map((i) => i.city[i.city.length - 1]).toString(),
                    near: area,
                  }[areaType],
                  ...goodsList,
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

  // 获取品牌列表
  const fetchBrandManagementList = () => {
    dispatch({
      type: 'businessBrand/fetchGetList',
      payload: {
        page: 1,
        limit: 999,
      },
    });
  };

  // 下一步
  const handleNextStep = (buttonType) => {
    if (buttonType === 'next') {
      form.validateFields().then((values) => {
        const { free, contact } = couponData;
        if (current == 0 && !values.jumpUrl && !contact.length && !free.goodsName) {
          notification.info({
            message: '温馨提示',
            description: '请选择一个商品或输入一个链接',
          });
          return;
        }
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
      title: '投放设置',
      content: <SharePutInSet {...stepProps}></SharePutInSet>,
    },
  ];

  const modalProps = {
    title: '发布分享',
    visible: show,
    width: 800,
    maskClosable: current === 0,
    onClose,
    afterCallBack: () => {
      fetchBrandManagementList();
    },
    closeCallBack: () => {
      setCurrent(0);
      setDataStorage({ relateType: 'merchant' });
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
  loading: loading.effects['videoAdvert/fetchVideoAdvertCreate'],
}))(ShareDrawer);
