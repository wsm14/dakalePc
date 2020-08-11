const MarketCardActivitySet = (props) => {
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
    title: '新增活动',
    loadingModels: 'marketCardActivity',
    formItems: [
      {
        label: '活动名称',
        name: 'walkSignBeanAmount',
      },
      {
        label: '活动时间',
        type: 'rangePicker',
        name: 'walkSignBea1nAmount',
      },
      {
        label: 'banner图',
        type: 'upload',
        name: 'walkSignBea2nAmou2nt',
        maxFile: 1,
      },
      {
        label: '活动链接',
        name: 'walkStepCount',
        extra: '跳转进入的H5活动页面链接',
        addRules: [
          {
            type: 'url',
            message: '请输入正确链接格式',
          },
        ],
      },
      {
        type: 'textArea',
        label: '活动简述',
        name: 'walkStepCounst',
      },
    ],
    onFinish: fetchRuningSet,
    ...props,
  };
};

export default MarketCardActivitySet;
