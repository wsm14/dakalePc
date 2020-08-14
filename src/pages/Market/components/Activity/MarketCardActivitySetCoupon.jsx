import moment from 'moment';

const MarketCardActivitySetCoupon = (props) => {
  const {
    dispatch,
    childRef,
    payload: { marketCouponId, initialValues, merchantName },
  } = props;

  // 提交表单
  const fetchGetFormData = (values) => {
    const { mark, moment } = values;
    const couponBtn = [];
    if (mark) couponBtn.push('mark');
    if (moment) couponBtn.push('moment');
    dispatch({
      type: 'marketCardActivity/fetchMarketActivityCouponSet',
      payload: { ...values, marketCouponId, couponChannels: couponBtn.toString() },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  const { couponChannels: ccls = '' } = initialValues;

  const cclsIndexOf = (val) => ({ true: '开启', false: '关闭' }[ccls.indexOf(val) > -1]);

  const drawerType = {
    true: { showType: 'info', title: '查看优惠券', footerShow: false },
    false: { showType: 'form', title: '新增优惠券', footerShow: true },
  }[!!initialValues];

  return {
    type: 'Drawer',
    showType: drawerType.showType,
    title: `${drawerType.title} - ${merchantName}`,
    loadingModels: 'marketCardActivity',
    initialValues: initialValues || { couponType: '0' },
    footerShow: drawerType.footerShow,
    formItems: [
      {
        label: '券类型',
        type: 'select',
        name: 'couponType',
        select: ['抵扣券'],
        disabled: true,
        render: () => '抵扣券',
      },
      {
        label: '券名称',
        name: 'couponName',
        disabled: !!initialValues,
        maxLength: 20,
      },
      {
        label: '券金额',
        type: 'number',
        name: 'couponValue',
        disabled: !!initialValues,
      },
      {
        label: '有效期',
        name: 'activeDays',
        extra: '输入天数，自领取成功之后该天数内有效',
        suffix: '天',
        addRules: [{ pattern: /^\+?[1-9]\d*$/, message: '天数应为整数' }],
        disabled: !!initialValues,
        render: (val) => `自领取成功之后 ${val} 天内有效`,
      },
      {
        title: '设置领券关联',
        label: '关联到店打卡',
        type: 'switch',
        valuePropName: 'checked',
        name: 'mark',
        rules: [],
        disabled: !!initialValues,
        render: () => cclsIndexOf('mark'),
      },
      {
        label: '关联看分享',
        type: 'switch',
        valuePropName: 'checked',
        name: 'moment',
        rules: [],
        disabled: !!initialValues,
        render: () => cclsIndexOf('moment'),
      },
    ],
    onFinish: fetchGetFormData,
    ...props,
  };
};

export default MarketCardActivitySetCoupon;
