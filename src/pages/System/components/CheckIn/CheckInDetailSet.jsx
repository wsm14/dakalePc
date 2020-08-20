const CheckInDetailSet = (props) => {
  const { dispatch, childRef, CeditType } = props;

  const fetchSysCheckIn = (values) => {
    dispatch({
      type: 'sysCheckIn/fetchPeasShareAdd',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  const formItem = {
    text: {
      title: '分享文案编辑',
      formItems: [
        {
          label: '文案',
          name: 'walkStepCount',
          type: 'textArea',
        },
      ],
    },
    img: {
      title: '分享图片编辑',
      formItems: [
        {
          label: '图片上传',
          type: 'upload',
          maxFile: 1,
          name: 'couponBanner',
        },
      ],
    },
  }[CeditType];

  return {
    type: 'Drawer',
    showType: 'form',
    loadingModels: 'sysCheckIn',
    ...formItem,
    onFinish: fetchSysCheckIn,
    ...props,
  };
};

export default CheckInDetailSet;
