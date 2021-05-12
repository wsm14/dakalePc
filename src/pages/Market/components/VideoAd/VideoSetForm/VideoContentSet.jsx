import React, { useState } from 'react';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from './ShareContent/ShareCoupon';
import FreeCouponSelectModal from './ShareContent/FreeCouponSelectModal';
import FreeContactSelectModal from './ShareContent/FreeContactSelectModal';

/**
 * 内容设置
 */
const VideoContentSet = (props) => {
  const {
    form,
    tradeList, // 行业列表
    selectList, // 店铺列表
    couponData,
    setCouponData,
    dispatch,
    detail,
    loading,
    saveDataStorage,
  } = props;

  const { merchantId, userType } = detail;
  const { free, contact } = couponData;

  const [visibleSelect, setVisibleSelect] = useState(false); // 免费券选择
  const [visibleContact, setVisibleContact] = useState(false); // 优惠选择

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
      onChange: (val, data) => {
        saveDataStorage({
          merchantId: val,
          topCategoryId: data.option.topCategoryId,
          topCategoryName: data.option.topCategoryName,
        });
        form.setFieldsValue({ topCategoryId: data.option.topCategoryId });
      },
      onSearch: (val) => fetchClassifyGetMre(val),
    },
    {
      label: '上传封面',
      name: 'dasd',
      type: 'upload',
      maxFile: 1,
      rules: [{ required: false }],
    },
    {
      label: '上传视频',
      name: 'remssdson',
      type: 'videoUpload',
      maxFile: 1,
    },
    {
      label: '视频标题',
      name: 'title',
      maxLength: 20,
    },
    {
      label: '分享内容',
      name: 'tisdtle',
      type: 'textArea',
      maxLength: 500,
    },
    {
      label: '行业分类',
      type: 'cascader',
      name: 'topCategoryId',
      select: tradeList,
      disabled: true,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
    },
    {
      label: '免费券',
      type: 'formItem',
      formItem: (
        <ShareCoupon
          type="coupon"
          data={free}
          onDel={() => saveCouponStorage({ free: {} })}
          onSelect={() => setVisibleSelect(true)}
        ></ShareCoupon>
      ),
    },
    {
      label: '关联优惠',
      type: 'formItem',
      formItem: (
        <ShareCoupon
          type="goods"
          data={contact}
          onDel={() => saveCouponStorage({ contact: {} })}
          onSelect={() => setVisibleContact(true)}
        ></ShareCoupon>
      ),
    },
  ];

  const selectProps = {
    ownerId: merchantId,
    ownerType: userType,
  };

  return (
    <>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
      {/* 免费券选择 */}
      <FreeCouponSelectModal
        {...selectProps}
        visible={visibleSelect}
        onOk={(free) => saveCouponStorage({ free })}
        onClose={() => setVisibleSelect(false)}
      ></FreeCouponSelectModal>
      {/* 优惠选择 */}
      <FreeContactSelectModal
        {...selectProps}
        visible={visibleContact}
        onOk={(contact) => saveCouponStorage({ contact })}
        onClose={() => setVisibleContact(false)}
      ></FreeContactSelectModal>
    </>
  );
};

export default connect(({ businessList, sysTradeList, loading }) => ({
  selectList: businessList.selectList,
  tradeList: sysTradeList.list.list,
  loading: loading.models.businessList,
}))(VideoContentSet);
