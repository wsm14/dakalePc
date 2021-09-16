import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { VIDEO_ADVERT_TYPE } from '@/common/constant';
import { VIDEO_ADVERT } from '@/common/imgRatio';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from '@/components/VideoSelectBindContent';

/**
 * 内容设置
 */
const VideoContentSet = (props) => {
  const {
    list,
    form,
    selectList, // 店铺列表
    couponData,
    setCouponData,
    dispatch,
    detail,
    loading,
  } = props;

  const { free, contact = [] } = couponData;
  const [relateType, setRelateType] = useState(false); // 广告类型

  useEffect(() => {
    setRelateType(detail.relateType);
  }, []);

  // 搜索店铺
  const fetchClassifyGetMre = debounce((name) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: { name, type: relateType },
    });
  }, 500);

  // 暂存券数据
  const saveCouponStorage = (val) => setCouponData({ ...couponData, ...val });

  const formItems = [
    {
      label: '广告类型',
      type: 'radio',
      name: 'relateType',
      select: VIDEO_ADVERT_TYPE,
      onChange: (e) => {
        form.setFieldsValue({ relateId: undefined });
        setRelateType(e.target.value);
        saveCouponStorage({ free: {}, contact: [] });
        dispatch({ type: 'baseData/clearGroupMre' }); // 清空选择数据
      },
    },
    {
      label: `选择${VIDEO_ADVERT_TYPE[relateType]}`,
      type: 'select',
      loading,
      placeholder: '请输入搜索',
      name: 'relateId',
      select: selectList,
      visible: relateType !== 'brand',
      onSearch: (val) => fetchClassifyGetMre(val),
      onChange: (val, data) => {
        saveCouponStorage({ free: {}, contact: [] });
      },
    },
    {
      label: '选择品牌',
      type: 'select',
      placeholder: '请输入搜索',
      name: 'relateId',
      select: list,
      visible: relateType == 'brand',
      fieldNames: { label: 'brandName', value: 'configBrandIdString' },
    },
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
      rules: [{ required: false }],
      hidden: true,
    },
    {
      label: '视频时长',
      name: 'length',
      hidden: true,
    },
    {
      label: '视频标题',
      name: 'title',
      maxLength: 20,
    },
    {
      label: '分享内容',
      name: 'message',
      type: 'textArea',
      maxLength: 50,
    },
    {
      label: '跳转链接',
      name: 'jumpUrl',
      rules: [{ required: relateType === 'brand' }],
    },
    {
      label: '免费券',
      type: 'formItem',
      visible: relateType !== 'brand',
      formItem: (
        <ShareCoupon
          type="coupon"
          merchantIdKey="relateId"
          show="free"
          data={free}
          form={form}
          ownerType={relateType}
          onDel={() => saveCouponStorage({ free: {} })}
          onOk={(free) => saveCouponStorage({ free })}
        ></ShareCoupon>
      ),
    },
    {
      label: '推荐带货',
      type: 'formItem',
      visible: relateType !== 'brand',
      formItem: (
        <>
          <ShareCoupon
            show="active"
            form={form}
            merchantIdKey="relateId"
            type={contact[0]?.couponName ? 'coupon' : 'goods'}
            data={contact[0]}
            ownerType={relateType}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 0) })}
            onOk={(data) => saveCouponStorage({ contact: [data] })}
          ></ShareCoupon>
          <ShareCoupon
            form={form}
            show="active"
            merchantIdKey="relateId"
            type={contact[1]?.couponName ? 'coupon' : 'goods'}
            data={contact[1]}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 1) })}
            onOk={(data) => saveCouponStorage({ contact: [...contact, data] })}
          ></ShareCoupon>
          <ShareCoupon
            form={form}
            show="active"
            merchantIdKey="relateId"
            type={contact[2]?.couponName ? 'coupon' : 'goods'}
            data={contact[2]}
            ownerType={relateType}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 2) })}
            onOk={(data) => saveCouponStorage({ contact: [...contact, data] })}
          ></ShareCoupon>
        </>
      ),
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default connect(({ baseData, businessBrand, loading }) => ({
  list: businessBrand.list,
  selectList: baseData.groupMreList,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(VideoContentSet);
