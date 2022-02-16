import React from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import moment from 'moment';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const CheckInSet = (props) => {
  const { dispatch, cRef, visible, onClose, loading } = props;
  const { initialValues = {}, show = false } = visible;
  const [form] = Form.useForm();

  const detail = {
    ...initialValues,
    beginMark: [moment(initialValues.beginMark, 'HH:mm'), moment(initialValues.endMark, 'HH:mm')],
  };

  const fetchSysCheckIn = () => {
    form.validateFields().then((values) => {
      let times = {};
      if (initialValues.identify === 'habit') {
        const { beginMark: time } = values;
        times = { beginMark: time[0].format('HH:mm'), endMark: time[1].format('HH:mm') };
      }
      dispatch({
        type: 'sysCheckIn/fetchCheckInEdit',
        payload: {
          ...values,
          identify: initialValues.identify,
          subIdentify: initialValues.subIdentify,
          ...times,
        },
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  const formItems = [
    {
      label: '打卡时间',
      type: 'timePicker',
      visible: initialValues.identify === 'habit',
      name: 'beginMark',
    },
    {
      label: '寄语',
      name: 'letter',
      type: 'textArea',
    },
  ];

  const modalProps = {
    title: '打卡编辑',
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={fetchSysCheckIn} loading={loading}>
        确定
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['sysCheckIn/fetchCheckInEdit'],
}))(CheckInSet);
