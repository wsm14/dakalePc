const MarketCardActivitySetCoupon = (props) => {
  const { dispatch, childRef } = props;

  const fetchRuningSet = (values) => {
    dispatch({
      type: 'marketCardActivity/fetchMarketMatchRuningSet',
      payload: values,
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
        name: 'walkSignBea1nAmount',
        select: [],
      },
      {
        label: '券名称',
        name: 'walkSignBea2nAmou2nt',
      },
      {
        label: '券金额',
        type: 'number',
        name: 'walkStepCount',
      },
      {
        label: '有效期',
        name: 'walkStepCsount',
        extra: '输入天数，自领取成功之后该天数内有效',
        addonAfter: '天',
        addRules: [{ pattern: /^\+?[1-9]\d*$/, message: '请输入正确天数' }],
      },
      {
        title: '设置领券关联',
        label: '关联到店打卡',
        type: 'switch',
        valuePropName: 'checked',
        name: 'walkStepCousnt',
      },
      {
        label: '关联看分享',
        type: 'switch',
        valuePropName: 'checked',
        name: 'walkStepCosusnt',
      },
    ],
    onFinish: fetchRuningSet,
    ...props,
  };
};

export default MarketCardActivitySetCoupon;
