import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from '@/components/VideoSelectBindContent';

/**
 * 带货设置
 */
const ShareContentSet = (props) => {
  const { form, couponData, setCouponData } = props;

  const { free, contact } = couponData;

  const [state, setstate] = useState('0'); // 互斥选择带货商品  0:全可选   1：有价券 特惠商品   2：电商商品

  // 暂存券数据
  const saveCouponStorage = (val) => setCouponData({ ...couponData, ...val });

  useEffect(() => {
    if (contact.length !== 0) {
      contact[0]?.activityType === 'commerceGoods' ? setstate('2') : setstate('1');
    } else {
      setstate('0');
    }
  }, [contact]);

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
      formItem: (
        <>
          <ShareCoupon
            isMutex={true}
            isMutexNum={state}
            show="active"
            merchantIdKey="ownerId"
            type={contact[0]?.couponName ? 'coupon' : 'goods'}
            data={contact[0]}
            form={form}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 0) })}
            onOk={(data) => saveCouponStorage({ contact: [data] })}
          ></ShareCoupon>
          <ShareCoupon
            isMutex={true}
            isMutexNum={state}
            show="active"
            merchantIdKey="ownerId"
            type={contact[1]?.couponName ? 'coupon' : 'goods'}
            data={contact[1]}
            form={form}
            onDel={() => saveCouponStorage({ contact: contact.filter((c, i) => i != 1) })}
            onOk={(data) => saveCouponStorage({ contact: [...contact, data] })}
          ></ShareCoupon>
          <ShareCoupon
            isMutex={true}
            isMutexNum={state}
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

  return <FormCondition form={form} formItems={formItems}></FormCondition>;
};

export default connect(({ loading }) => ({}))(ShareContentSet);
