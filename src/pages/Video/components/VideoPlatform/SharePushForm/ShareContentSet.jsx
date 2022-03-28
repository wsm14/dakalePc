import React, { useState } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { VIDEO_ADVERT } from '@/common/imgRatio';
import { BUSINESS_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from '@/components/VideoSelectBindContent';

/**
 * 内容设置
 */
const ShareContentSet = (props) => {
  const {
    form,
    tradeList, // 行业列表
    selectList, // 店铺列表
    couponData,
    setCouponData,
    dispatch,
    detail,
    loading,
    tabtype,
  } = props;

  const { free, contact } = couponData;
  const [ownerType, setOwnerType] = useState('merchant'); // 店铺类型

  // 搜索店铺
  const fetchClassifyGetMre = debounce((name) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: { name, type: ownerType, groupFlag: 0 },
    });
  }, 500);

  // 暂存券数据
  const saveCouponStorage = (val) => setCouponData({ ...couponData, ...val });

  const formItems = [
    {
      label: '选择店铺类型',
      type: 'radio',
      name: 'ownerType',
      select: BUSINESS_TYPE,
      onChange: (e) => {
        setOwnerType(e.target.value); // 重置店铺类型
        form.setFieldsValue({ ownerId: undefined }); // 重置数据
        dispatch({ type: 'baseData/clearGroupMre' }); // 清空选择数据
      },
    },
    {
      label: `选择${BUSINESS_TYPE[ownerType]}`,
      type: 'select',
      loading,
      placeholder: '请输入搜索',
      name: 'ownerId',
      select: selectList,
      onSearch: (val) => fetchClassifyGetMre(val),
      onChange: (val, data) => {
        const { option } = data;
        saveCouponStorage({ free: {}, contact: [] });
        form.setFieldsValue({
          categoryNode: option.topCategoryId,
          topCategoryId: option.topCategoryId[0],
          categoryId: option.topCategoryId[1],
          districtCode: option.districtCode,
        });
      },
    },
    {
      label: '地区名称用来搜索地图',
      name: 'districtCode',
      hidden: true,
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
      name: 'videoUrl',
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
    // {
    //   label: '视频标题',
    //   name: 'title',
    //   maxLength: 20,
    // },
    {
      label: '分享内容',
      name: 'message',
      type: 'textArea',
      maxLength: 50,
    },
    {
      label: '行业分类',
      type: 'cascader',
      name: 'categoryNode',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      onChange: (val) => {
        form.setFieldsValue({
          topCategoryId: val[0],
          categoryId: val[1],
        });
      },
    },
    {
      name: 'topCategoryId', // 一级行业id
      hidden: true,
    },
    {
      name: 'categoryId', // 二级行业id
      hidden: true,
    },
    {
      label: '免费券',
      type: 'formItem',
      visible: tabtype === '1',
      formItem: (
        <ShareCoupon
          type="coupon"
          merchantIdKey="ownerId"
          show="free"
          data={free}
          form={form}
          ownerType={ownerType}
          onDel={() => saveCouponStorage({ free: {} })}
          onOk={(free) => saveCouponStorage({ free })}
        ></ShareCoupon>
      ),
    },
    {
      label: '推荐带货',
      type: 'formItem',
      visible: tabtype === '1',
      formItem: (
        <>
          <ShareCoupon
            show="active"
            form={form}
            merchantIdKey="ownerId"
            type={contact[0]?.couponName ? 'coupon' : 'goods'}
            data={contact[0]}
            ownerType={ownerType}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 0) })}
            onOk={(data) => saveCouponStorage({ contact: [data] })}
          ></ShareCoupon>
          <ShareCoupon
            form={form}
            show="active"
            merchantIdKey="ownerId"
            type={contact[1]?.couponName ? 'coupon' : 'goods'}
            data={contact[1]}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 1) })}
            onOk={(data) => saveCouponStorage({ contact: [...contact, data] })}
          ></ShareCoupon>
          <ShareCoupon
            form={form}
            show="active"
            merchantIdKey="ownerId"
            type={contact[2]?.couponName ? 'coupon' : 'goods'}
            data={contact[2]}
            ownerType={ownerType}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 2) })}
            onOk={(data) => saveCouponStorage({ contact: [...contact, data] })}
          ></ShareCoupon>
        </>
      ),
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default connect(({ baseData, sysTradeList, loading }) => ({
  selectList: baseData.groupMreList,
  tradeList: sysTradeList.list.list,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(ShareContentSet);
