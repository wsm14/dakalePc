import React, { useEffect } from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

/**
 * 固定写死携带默认值
 * @param {Array} paramKey app跳转参数键值
 */
export default ({ paramKey, showApi, form }) => {
  const labelText = {
    title: { label: '标题' },
    type: { label: '接口类型' },
    isEveryDayPush: { label: '是否每日推送' },
    bannerType: { label: 'Banner类型' },
    giftType: { label: '礼包类型' },
  };

  const checkShowApi = () => {
    let obj = {};
    // 小豆精选
    if (showApi === 'beanSelection') {
      obj = {
        type: 'dayPush',
        title: '小豆精选',
        isEveryDayPush: '0',
        bannerType: showApi,
      };
    }
    // 今日上新
    if (showApi === 'newToday') {
      obj = {
        type: 'todayNew',
        title: '今日上新',
      };
    }
    // 话费抵扣券包
    if (showApi === 'telephoneFeeDeductionCouponPackage') {
      obj = {
        giftType: 'telephoneCharges',
      };
    }
    // 平台通用券包
    if (showApi === 'platformGeneralCouponPackage') {
      obj = {
        giftType: 'beanWelfare',
      };
    }
    // 电商品券包
    if (showApi === 'commerceGoodsPackage') {
      obj = {
        giftType: 'ecGoods',
      };
    }

    form.setFieldsValue({ param: obj });
  };

  useEffect(() => {
    checkShowApi();
  }, [showApi]);

  return paramKey.map((item) => (
    <FormItem
      label={labelText?.item?.label || item}
      key={`giftType${item}`}
      name={['param', item]}
      style={{ maxWidth: '100%' }}
      rules={[{ required: true, message: '请填写内容' }]}
    >
      <Input></Input>
    </FormItem>
  ));
};
