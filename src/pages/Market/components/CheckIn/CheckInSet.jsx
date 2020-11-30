import moment from 'moment';

const CheckInSet = (props) => {
  const { dispatch, childRef, rowData } = props;

  const fetchSysCheckIn = (values) => {
    let times = {};
    if (rowData.identify === 'habit') {
      const { beginMark: time } = values;
      times = { beginMark: time[0].format('HH:mm'), endMark: time[1].format('HH:mm') };
    }
    dispatch({
      type: 'sysCheckIn/fetchCheckInEdit',
      payload: {
        ...values,
        identify: rowData.identify,
        subIdentify: rowData.subIdentify,
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
      beginMark: [moment(rowData.beginMark, 'HH:mm'), moment(rowData.endMark, 'HH:mm')],
      letter: rowData.letter,
    },
    formItems: [
      {
        label: '打卡时间',
        type: 'timePicker',
        visible: rowData.identify === 'habit',
        name: 'beginMark',
      },
      {
        label: '寄语',
        name: 'letter',
        type: 'textArea',
      },
    ],
    onFinish: fetchSysCheckIn,
    ...props,
  };
};

export default CheckInSet;
