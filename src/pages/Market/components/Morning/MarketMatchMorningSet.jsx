const MarketMatchMorningSet = (props) => {
  const { dispatch, childRef } = props;

  const fetchMorningSet = (values) => {
    dispatch({
      type: 'marketCardRMing/fetchMarketMatchMorningSet',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '早起挑战赛设置',
    loadingModels: 'marketCardRMing',
    formItems: [
      {
        type: 'number',
        label: '报名卡豆数',
        name: 'wakeUpSignBeanAmount',
        extra: '设置成功之后，对下一期生效',
      },
    ],
    onFinish: fetchMorningSet,
    ...props,
  };
};

export default MarketMatchMorningSet;
