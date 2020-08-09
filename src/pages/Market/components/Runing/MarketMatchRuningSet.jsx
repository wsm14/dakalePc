const MarketMatchRuningSet = (props) => {
  const { dispatch, childRef } = props;

  const fetchRuningSet = (values) => {
    dispatch({
      type: 'marketCardRMing/fetchMarketMatchRuningSet',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '步数挑战赛设置',
    loadingModels: 'marketCardRMing',
    formItems: [
      {
        type: 'number',
        label: '报名卡豆数',
        name: 'walkSignBeanAmount',
      },
      {
        type: 'number',
        label: '目标步数',
        name: 'walkStepCount',
        extra: '设置成功之后，对下一期生效',
      },
    ],
    onFinish: fetchRuningSet,
    ...props,
  };
};

export default MarketMatchRuningSet;
