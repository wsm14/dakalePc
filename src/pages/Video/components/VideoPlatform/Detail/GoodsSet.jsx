import React from 'react';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from '@/components/VideoSelectBindContent';

/**
 * 带货设置
 */
const ShareContentSet = (props) => {
  const { form, couponData, detail, setCouponData } = props;

  const { free, contact } = couponData;

  // 暂存券数据
  const saveCouponStorage = (val) => setCouponData({ ...couponData, ...val });

  const formItems = [
    {
      label: `店铺信息`,
      name: 'ownerId',
      hidden: true,
    },
    {
      label: '免费券',
      type: 'formItem',
      formItem: (
        <ShareCoupon
          ownerType={detail.ownerType}
          type="coupon"
          merchantIdKey="ownerId"
          show="free"
          data={free}
          form={form}
          ownerType={detail.ownerType}
          onDel={() => saveCouponStorage({ free: {} })}
          onOk={(free) => saveCouponStorage({ free })}
        ></ShareCoupon>
      ),
    },
    {
      label: '推荐带货',
      type: 'formItem',
      formItem: (
        <>
          <ShareCoupon
            show="active"
            ownerName={detail.ownerName}
            merchantIdKey="ownerId"
            type={contact[0]?.couponName ? 'coupon' : 'goods'}
            data={contact[0]}
            form={form}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 0) })}
            onOk={(data) => saveCouponStorage({ contact: data })}
          ></ShareCoupon>
          <ShareCoupon
            show="active"
            merchantIdKey="ownerId"
            ownerName={detail.ownerName}
            type={contact[1]?.couponName ? 'coupon' : 'goods'}
            data={contact[1]}
            form={form}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 1) })}
            onOk={(data) => saveCouponStorage({ contact: [...contact, ...data] })}
          ></ShareCoupon>
          <ShareCoupon
            show="active"
            merchantIdKey="ownerId"
            ownerName={detail.ownerName}
            type={contact[2]?.couponName ? 'coupon' : 'goods'}
            data={contact[2]}
            form={form}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 2) })}
            onOk={(data) => saveCouponStorage({ contact: [...contact, ...data] })}
          ></ShareCoupon>
        </>
      ),
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default connect(({ loading }) => ({}))(ShareContentSet);
