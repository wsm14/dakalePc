import React, { useState } from 'react';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from './ShareContent/ShareCoupon';
import FreeCouponSelectModal from './ShareContent/FreeCouponSelectModal';
import FreeContactSelectModal from './ShareContent/FreeContactSelectModal';

/**
 * 内容设置
 */
const ShareContentSet = (props) => {
  const { form, tradeList, couponData, setCouponData, detail, saveDataStorage } = props;

  const { merchantId, userType } = detail;
  const { free, contact } = couponData;

  const [visibleSelect, setVisibleSelect] = useState(false); // 免费券选择
  const [visibleContact, setVisibleContact] = useState(false); // 优惠选择

  // 暂存券数据
  const saveCouponStorage = (val) => setCouponData({ ...couponData, ...val });

  const formItems = [
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
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      // 后端需要名字两级id
      onChange: (val, option) =>
        saveDataStorage({
          topCategoryId: val,
          topCategoryName: [option[0].categoryName, option[1].categoryName],
        }),
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

export default connect(({ sysTradeList }) => ({
  tradeList: sysTradeList.list.list,
}))(ShareContentSet);
