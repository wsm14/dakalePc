import { NUM_INT } from '@/common/regExp';
const MarketCardActivitySetCoupon = (props) => {
  const {
    dispatch,
    childRef,
    payload: { marketCouponId, initialValues, merchantName, activityId },
  } = props;

  // 提交表单
  const fetchGetFormData = (values) => {
    const { mark, moment } = values;
    const couponBtn = [];
    if (mark) couponBtn.push('mark');
    if (moment) couponBtn.push('moment');
    dispatch({
      type: 'marketCardActivity/fetchMarketActivityCouponSet',
      payload: { ...values, marketCouponId, couponChannels: couponBtn.toString(), activityId },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  const { couponChannels: ccls = '' } = initialValues;

  const cclsIndexOf = (val) => ({ true: '开启', false: '关闭' }[ccls.indexOf(val) > -1]);

  // 默认值参数 则显示info详情，否则添加表单
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
        maxLength: 20,
        render: (val) => val || '活动已下架，未添加',
      },
      {
        label: '券金额',
        type: 'number',
        name: 'couponValue',
        render: (val) => val || '活动已下架，未添加',
      },
      {
        label: '有效期',
        name: 'activeDays',
        extra: '输入天数，自领取成功之后该天数内有效',
        addonAfter: '天',
        addRules: [{ pattern: NUM_INT, message: '天数应为整数' }],
        render: (val) => (val ? `自领取成功之后 ${val} 天内有效` : '活动已下架，未添加'),
      },
      {
        title: '设置领券关联',
        label: '关联到店打卡',
        type: 'switch',
        valuePropName: 'checked',
        name: 'mark',
        rules: [],
        render: () => cclsIndexOf('mark'),
      },
      {
        label: '关联看分享',
        type: 'switch',
        valuePropName: 'checked',
        name: 'moment',
        rules: [],
        render: () => cclsIndexOf('moment'),
      },
    ],
    onFinish: fetchGetFormData,
    ...props,
  };
};

export default MarketCardActivitySetCoupon;
