import moment from 'moment';

const CheckInSet = (props) => {
  const { dispatch, childRef, rowData } = props;

  const fetchSysCheckIn = (values) => {
    let times = {};
    if (rowData.markType !== 'health') {
      const { markBeginTime: time } = values;
      times = { markBeginTime: time[0].format('HH:mm'), markEndTime: time[1].format('HH:mm') };
    }
    dispatch({
      type: 'sysCheckIn/fetchCheckInEdit',
      payload: {
        ...values,
        marketConfigId: rowData.markConfigIdString,
        ...times,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: '打卡编辑',
    loadingModels: 'sysCheckIn',
    initialValues: {
      markBeginTime: [moment(rowData.markBeginTime, 'HH:mm'), moment(rowData.markEndTime, 'HH:mm')],
      remark: rowData.remark,
    },
    formItems: [
      {
        label: '打卡时间',
        type: 'timePicker',
        visible: rowData.markType !== 'health',
        name: 'markBeginTime',
      },
      {
        label: '寄语',
        name: 'remark',
        type: 'textArea',
      },
    ],
    onFinish: fetchSysCheckIn,
    ...props,
  };
};

export default CheckInSet;
