const CheckInSet = (props) => {
  const { dispatch, childRef } = props;

  const fetchSysCheckIn = (values) => {
    dispatch({
      type: 'sysCheckIn/fetchPeasShareAdd',
      payload: values,
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '寄语编辑',
    loadingModels: 'sysCheckIn',
    formItems: [
      {
        label: '打卡时间',
        name: 'walkSignBeanAmount',
        visible: false,
        type: 'rangePicker',
      },
      {
        label: '寄语',
        name: 'walkStepCount',
        type: 'textArea',
      },
    ],
    onFinish: fetchSysCheckIn,
    ...props,
  };
};

export default CheckInSet;
