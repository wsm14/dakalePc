import React from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import { VIDEO_ADVERT, VIDEO_SHARE_IMG } from '@/common/imgRatio';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from '@/components/VideoSelectBindContent';

/**
 * 内容设置
 */
const ShareContentSet = (props) => {
  const {
    form,
    platformBean,
    bean,
    tradeList, // 行业列表
    selectList, // 店铺列表
    couponData,
    setCouponData,
    getMerchantIdInfo,
    dispatch,
    detail,
    loading,
  } = props;

  const { free, contact } = couponData;

  // 搜索店铺
  const fetchClassifyGetMre = debounce((name) => {
    if (!name) return;
    dispatch({
      type: 'baseData/fetchGetGroupMreList',
      payload: { name },
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
        getMerchantIdInfo(val);
        const { option } = data;
        saveCouponStorage({ free: {}, contact: {} });
        form.setFieldsValue({
          categoryNode: option.topCategoryId,
          topCategoryId: option.topCategoryId[0],
          categoryId: option.topCategoryId[1],
          topCategoryName: option.topCategoryName[0],
          categoryName: option.topCategoryName[1],
        });
      },
      extra: `商家账户卡豆数：${bean}，平台补贴卡豆数：${platformBean}`,
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
            videoContentOb: { height: videoElement.videoHeight, width: videoElement.videoWidth },
          });
        });
        videoElement.src = fileurl;
        videoElement.load();
      },
    },
    {
      label: '微信好友分享图',
      name: 'friendShareImg',
      type: 'upload',
      maxFile: 1,
      maxSize: 128,
      imgRatio: VIDEO_SHARE_IMG,
      rules: [{ required: false }],
      extra: '请上传比例为5：4，大小128kb以内的jpg图片（250*200以上）',
    },
    {
      label: '视频id',
      name: 'videoId',
      hidden: true,
      rules: [{ required: false }],
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
          topCategoryId: val[0],
          categoryId: val[1],
          topCategoryName: option[0].categoryName,
          categoryName: option[1].categoryName,
        });
      },
    },
    {
      label: '权重',
      type: 'number',
      name: 'recommendWeight',
      placeholder: '数值越大越靠前',
    },
    {
      name: 'topCategoryId', // 一级行业id
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
      name: 'categoryId', // 二级行业id
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

export default connect(({ shareManage, baseData, sysTradeList, loading }) => ({
  platformBean: shareManage.platformBean,
  bean: shareManage.bean,
  selectList: baseData.groupMreList,
  tradeList: sysTradeList.list.list,
  loading: loading.effects['baseData/fetchGetGroupMreList'],
}))(ShareContentSet);
