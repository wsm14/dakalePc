import React from 'react';
import { VIDEO_ADVERT } from '@/common/imgRatio';
import FormCondition from '@/components/FormCondition';
import { NewNativeFormSet } from '@/components/FormListCondition';
import ShareCoupon from '@/components/VideoSelectBindContent';

/**
 * 带货修改
 */
const GoodsEdit = (props) => {
  const { form, detail, couponData, setCouponData, showTitle, setShowTitle } = props;

  const { free, contact } = couponData;

  // 暂存券数据
  const saveCouponStorage = (val) => setCouponData({ ...couponData, ...val });

  const formItems = [
    {
      label: '上传封面',
      name: 'frontImage',
      type: 'upload',
      maxFile: 1,
      maxSize: 500,
      imgRatio: VIDEO_ADVERT,
    },
    {
      label: '上传视频',
      name: 'url',
      type: 'videoUpload',
      maxFile: 1,
      onChange: ({ file }) => {
        const fileurl = URL.createObjectURL(file);
        // 获取视频的时长 长宽高
        const videoElement = document.createElement('video');
        videoElement.addEventListener('loadedmetadata', function (_event) {
          const duration = videoElement.duration; // 单位：秒
          form.setFieldsValue({
            length: parseInt(duration),
            videoId: undefined,
          });
        });
        videoElement.src = fileurl;
        videoElement.load();
      },
    },
    {
      label: '视频id',
      name: 'videoId',
      hidden: true,
      rules: [{ required: false }],
    },
    {
      label: '视频时长',
      name: 'length',
      hidden: true,
    },
    {
      label: '商户id',
      name: 'ownerId',
      hidden: true,
    },
    {
      label: '分享内容',
      name: 'message',
      type: 'textArea',
      maxLength: 50,
    },
    // {
    //   label: '跳转链接',
    //   name: 'jumpUrl',
    //   rules: [{ required: detail.relateType === 'brand' }],
    // },
    {
      type: 'noForm',
      formItem: (
        <NewNativeFormSet
          form={form}
          detail={detail}
          // port={tabKey}
          // getJumpType={setShowTitle}
        ></NewNativeFormSet>
      ),
    },
    // {
    //   label: '是否显示标题',
    //   type: 'switch',
    //   name: 'hideTitle',
    //   visible: showTitle === 'H5',
    // },
    {
      label: '免费券',
      type: 'formItem',
      visible: detail.relateType !== 'brand',
      formItem: (
        <ShareCoupon
          type="coupon"
          merchantIdKey="ownerId"
          show="free"
          data={free}
          form={form}
          onDel={() => saveCouponStorage({ free: {} })}
          onOk={(free) => saveCouponStorage({ free })}
        ></ShareCoupon>
      ),
    },
    {
      label: '推荐带货',
      type: 'formItem',
      visible: detail.relateType !== 'brand',
      formItem: (
        <>
          <ShareCoupon
            show="active"
            merchantIdKey="ownerId"
            type={contact[0]?.couponName ? 'coupon' : 'goods'}
            data={contact[0]}
            form={form}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 0) })}
            onOk={(data) => saveCouponStorage({ contact: [data] })}
          ></ShareCoupon>
          <ShareCoupon
            show="active"
            merchantIdKey="ownerId"
            type={contact[1]?.couponName ? 'coupon' : 'goods'}
            data={contact[1]}
            form={form}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 1) })}
            onOk={(data) => saveCouponStorage({ contact: [...contact, data] })}
          ></ShareCoupon>
          <ShareCoupon
            show="active"
            merchantIdKey="ownerId"
            type={contact[2]?.couponName ? 'coupon' : 'goods'}
            data={contact[2]}
            form={form}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 2) })}
            onOk={(data) => saveCouponStorage({ contact: [...contact, data] })}
          ></ShareCoupon>
        </>
      ),
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default GoodsEdit;
