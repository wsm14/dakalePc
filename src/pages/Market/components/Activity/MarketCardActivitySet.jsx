const MarketCardActivitySet = (props) => {
  const { dispatch, childRef } = props;

  const fetchMarketActivityAdd = (values) => {
    const { activityBeginTime: time } = values;
    const payload = {
      ...values,
      activityBeginTime: time[0].format('YYYY-MM-DD 00:00:00'),
      activityEndTime: time[1].format('YYYY-MM-DD 00:00:00'),
    };
    console.log(payload);
    // dispatch({
    //   type: 'marketCardActivity/fetchMarketActivityAdd',
    //   payload: values,
    //   callback: () => childRef.current.fetchGetData(),
    // });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '新增活动',
    loadingModels: 'marketCardActivity',
    formItems: [
      {
        label: '活动名称',
        name: 'activityName',
      },
      {
        label: '活动时间',
        type: 'rangePicker',
        name: 'activityBeginTime',
      },
      {
        label: 'banner图',
        type: 'upload',
        name: 'activityBanner',
        maxFile: 3,
      },
      {
        label: '活动链接',
        name: 'activityUrl',
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
        name: 'description',
      },
    ],
    onFinish: fetchMarketActivityAdd,
    ...props,
  };
};

export default MarketCardActivitySet;
