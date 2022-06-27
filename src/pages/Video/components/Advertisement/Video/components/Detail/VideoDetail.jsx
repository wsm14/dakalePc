import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Form, Button, notification } from 'antd';
import { VIDEO_ADVERT_TYPE, SHARE_SEX_TYPE } from '@/common/constant';
import { checkCityName } from '@/utils/utils';
import {
  couponsDom,
  goodsDom,
  commerceDom,
} from '@/components/VideoSelectBindContent/CouponFreeDom';
import uploadLive from '@/utils/uploadLive';
import GoodsEdit from './GoodsEdit';
import DrawerCondition from '@/components/DrawerCondition';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import QuestionTooltip from '@/components/QuestionTooltip';

const VideoDetail = (props) => {
  const {
    dispatch,
    visible,
    tagList,
    total,
    getDetail,
    onClose,
    childRef,
    loading,
    loadingDetail,
  } = props;

  const { index, show = false, type = 'info', detail = {} } = visible;

  const { platformMomentId, relateId: ownerId } = detail;

  const [form] = Form.useForm();
  const [couponData, setCouponData] = useState({ free: {}, contact: [] }); // 选择券的信息
  const [showTitle, setShowTitle] = useState(null); // 是否显示标题

  useEffect(() => {
    if (type !== 'info') {
      form.setFieldsValue({ ownerId });
      setCouponData({ free: detail.free, contact: detail.contact });
    }
  }, [type]);

  // 信息
  const formItems = [
    {
      label: '广告类型',
      name: 'relateType',
      render: (val) => VIDEO_ADVERT_TYPE[val],
    },
    {
      label: `${VIDEO_ADVERT_TYPE[detail.relateType]}名称`,
      name: 'relateName',
    },
    {
      label: `视频`,
      name: ['videoContent', 'url'],
      type: 'videoUpload',
    },
    // {
    //   label: '标题',
    //   name: 'title',
    // },
    {
      label: '内容详情',
      name: 'message',
    },
    // {
    //   label: `收藏数`,
    //   name: 'collectionAmount',
    // },
    // {
    //   label: `分享数`,
    //   name: 'shareAmount',
    // },
    {
      label: '推荐带货',
      name: 'promotionList',
      render: (val, row) =>
        val.map((item) =>
          item.type === 'special'
            ? item.activityType === 'commerceGoods'
              ? commerceDom(item)
              : goodsDom(item)
            : couponsDom(item, '', '', item.type),
        ),
    },
    {
      label: `跳转链接`,
      name: 'jumpUrl',
    },
    {
      label: '投放设置',
      name: 'momentTagNames',
      render: (val) => (
        <>
          <div>推荐位置：{val}</div>
          <div>用户性别：{SHARE_SEX_TYPE[detail.gender]}</div>
          <div>用户年龄：{detail.age}</div>
          <div>
            区域选择：
            {
              {
                all: '全国',
                city: detail.area.split(',').map((i) => checkCityName(i)),
                district: detail.area.split(',').map((i) => checkCityName(i)),
                near: `${detail.beanAddress} 附近${detail.area}米`,
              }[detail.areaType]
            }
          </div>
          <div>兴趣标签：{detail.tags}</div>
        </>
      ),
    },
  ];

  const formItemsData = [
    {
      label: '浏览量',
      name: 'onlookersNum',
    },
    {
      label: '完播量',
      name: 'viewNum',
    },
    {
      label: '完播率',
      // name: '',
      render: (val, row) =>
        row.onlookersNum === 0 ? '0' : `${((row.viewNum / row.onlookersNum) * 100).toFixed(2)}%`,
    },
    {
      label: (
        <QuestionTooltip
          type="quest"
          title="收藏数"
          content="视频收藏数为初始数据+真实数据"
        ></QuestionTooltip>
      ),
      name: 'collectionSimulationNum',
      render: (val, row) => `${val}+${row.collectionRealNum}`,
    },
    {
      label: (
        <QuestionTooltip
          type="quest"
          title="分享数"
          content="视频分享数为初始数据+真实数据"
        ></QuestionTooltip>
      ),
      name: 'shareSimulationNum',
      render: (val, row) => `${val}+${row.shareRealNum}`,
    },
    {
      label: '累计打赏卡豆数',
      name: 'rewardBeanSum',
    },

    {
      label: '领豆人次',
      name: 'rewardPersonSum',
    },
  ];

  const handleUpdataSava = () => {
    form.validateFields().then((values) => {
      const { frontImage, url, title, videoId, ...other } = values;
      const { free = {}, contact = [] } = couponData;
      // if (!values.jumpUrl && !contact.length && !free.goodsName) {
      //   notification.info({
      //     message: '温馨提示',
      //     description: '请选择一个商品或输入一个链接',
      //   });
      //   return;
      // }

      let goodsList = {};
      if (detail.relateType !== 'brand') {
        // 券数据整理
        const newCoupon = [...contact, ...(free.ownerCouponIdString ? [{ ...free }] : [])];
        goodsList = {
          momentRelateList: newCoupon.map((item) => ({
            relateId: item.goodsId,
            relateType: item.activityType,
            relateShardingKey: item.ownerId || ownerId,
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
                type: 'videoAdvert/fetchVideoAdvertEdit',
                payload: {
                  ...other,
                  platformMomentId,
                  title,
                  frontImageWidth: 544, // 封面宽
                  frontImageHeight: 960, // 封面长
                  frontImage: imgs, // 封面连接
                  videoId: videos,
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

  const modalProps = {
    title:
      type == 'information'
        ? '数据统计'
        : `视频广告${{ info: '详情', edit: '编辑' }[type]} - ${detail.title}`,
    visible: show,
    onClose,
    loading: loadingDetail,
    dataPage: type == 'info' && {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    afterCallBack: () => {
      setShowTitle(detail.jumpUrlType);
    },
    footer: (
      <>
        {!['info', 'information'].includes(type) && (
          <Button type="primary" onClick={handleUpdataSava} loading={loading}>
            保存
          </Button>
        )}
      </>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {
        {
          // 详情
          info: (
            <>
              <DescriptionsCondition
                formItems={formItems}
                initialValues={detail}
              ></DescriptionsCondition>
            </>
          ),
          information: (
            <DescriptionsCondition
              formItems={formItemsData}
              initialValues={detail}
            ></DescriptionsCondition>
          ),
          // 修改
          edit: (
            <GoodsEdit
              form={form}
              detail={detail}
              couponData={couponData}
              setCouponData={setCouponData}
              showTitle={showTitle}
              setShowTitle={setShowTitle}
            ></GoodsEdit>
          ),
        }[type]
      }
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loadingDetail: loading.effects['videoAdvert/fetchVideoAdvertDetail'],
  loading: loading.effects['videoAdvert/fetchVideoAdvertEdit'],
}))(VideoDetail);
