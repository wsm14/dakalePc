import React from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { VIDEO_ADVERT } from '@/common/imgRatio';
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
  } = props;

  const { free, contact } = couponData;

  // 搜索店铺
  const fetchClassifyGetMre = debounce((merchantName) => {
    if (!merchantName) return;
    dispatch({
      type: 'businessList/fetchGetList',
      payload: {
        limit: 999,
        page: 1,
        bankStatus: 3,
        businessStatus: 1,
        merchantName,
      },
    });
  }, 500);

  // 暂存券数据
  const saveCouponStorage = (val) => setCouponData({ ...couponData, ...val });

  const formItems = [
    {
      label: '选择店铺',
      type: 'select',
      loading,
      placeholder: '请输入搜索',
      name: 'merchantId',
      select: selectList,
      onSearch: (val) => fetchClassifyGetMre(val),
      onChange: (val, data) => {
        const { option } = data;
        saveCouponStorage({ free: {}, contact: {} });
        form.setFieldsValue({
          categoryNode: option.topCategoryId,
          topCategoryIdStr: option.topCategoryId[0],
          categoryIdStr: option.topCategoryId[1],
          topCategoryName: option.topCategoryName[0],
          categoryName: option.topCategoryName[1],
        });
      },
    },
    {
      label: '上传封面',
      name: 'frontImage',
      type: 'upload',
      maxFile: 1,
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
            length: duration,
            videoContentOb: { height: videoElement.videoHeight, width: videoElement.videoWidth },
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
      label: '视频宽度',
      name: ['videoContentOb', 'height'],
      hidden: true,
    },
    {
      label: '视频高度',
      name: ['videoContentOb', 'width'],
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
      label: '行业分类',
      type: 'cascader',
      name: 'categoryNode',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      onChange: (val, option) => {
        form.setFieldsValue({
          categoryNode: val,
          topCategoryIdStr: val[0],
          categoryIdStr: val[1],
          topCategoryName: option[0].categoryName,
          categoryName: option[1].categoryName,
        });
      },
    },
    {
      name: 'topCategoryIdStr', // 一级行业id
      hidden: true,
    },
    {
      name: 'topCategoryName', // 一级行业名称
      hidden: true,
    },
    {
      name: 'categoryName', // 二级行业名称
      hidden: true,
    },
    {
      name: 'categoryIdStr', // 二级行业id
      hidden: true,
    },
    {
      label: '免费券',
      type: 'formItem',
      formItem: (
        <ShareCoupon
          type="coupon"
          merchantIdKey="merchantId"
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
      formItem: (
        <ShareCoupon
          show="active"
          merchantIdKey="merchantId"
          type={contact.couponName ? 'coupon' : 'goods'}
          data={contact}
          form={form}
          onDel={() => saveCouponStorage({ contact: {} })}
          onOk={(contact) => saveCouponStorage({ contact })}
        ></ShareCoupon>
      ),
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default connect(({ businessList, sysTradeList, loading }) => ({
  selectList: businessList.selectList,
  tradeList: sysTradeList.list.list,
  loading: loading.models.businessList,
}))(ShareContentSet);
