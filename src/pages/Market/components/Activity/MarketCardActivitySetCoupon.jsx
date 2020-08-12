const MarketCardActivitySetCoupon = (props) => {
  const { dispatch, childRef, marketCouponId } = props;

  const fetchGetFormData = (values) => {
    const { mark, moment } = values;
    const couponChannels = [];
    if (mark) couponChannels.push('mark');
    if (moment) couponChannels.push('moment');
    dispatch({
      type: 'marketCardActivity/fetchMarketActivityCouponSet',
      payload: { ...values, marketCouponId, couponChannels: couponChannels.toString() },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '新增优惠券',
    loadingModels: 'marketCardActivity',
    formItems: [
      {
        label: '券类型',
        type: 'select',
        name: 'couponType',
        select: ['抵扣券'],
      },
      {
        label: '券名称',
        name: 'couponName',
      },
      {
        label: '券金额',
        type: 'number',
        name: 'couponValue',
      },
      {
        label: '有效期',
        name: 'activeDays',
        extra: '输入天数，自领取成功之后该天数内有效',
        addonAfter: '天',
        addRules: [{ pattern: /^\+?[1-9]\d*$/, message: '请输入正确天数' }],
      },
      {
        title: '设置领券关联',
        label: '关联到店打卡',
        type: 'switch',
        valuePropName: 'checked',
        name: 'mark',
        rules: [],
      },
      {
        label: '关联看分享',
        type: 'switch',
        valuePropName: 'checked',
        name: 'moment',
        rules: [],
      },
    ],
    onFinish: fetchGetFormData,
    ...props,
  };
};

export default MarketCardActivitySetCoupon;
