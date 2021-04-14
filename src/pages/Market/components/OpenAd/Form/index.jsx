import React from 'react';
import moment from 'moment';
import { OPEN_ADVERT } from '@/common/imgRatio';
import JumpFormBlock from '@/components/JumpFormBlock';
import FormCondition from '@/components/FormCondition';

const OpenAdForm = (props) => {
  const { detail, form } = props;

  const formItems = [
    {
      label: '广告主名',
      name: 'launchOwner',
      maxLength: 20,
    },
    {
      label: '广告上传',
      type: 'upload',
      name: 'url',
      maxFile: 1,
      imgRatio: OPEN_ADVERT,
    },
    {
      label: '广告说明',
      type: 'textArea',
      name: 'launchDesc',
      maxLength: 200,
    },
    {
      label: '展示时间',
      name: 'activeDate',
      type: 'rangePicker',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      type: 'noForm',
      formItem: <JumpFormBlock form={form} detail={detail}></JumpFormBlock>,
    },
  ];

  return <FormCondition initialValues={detail} formItems={formItems} form={form} />;
};

export default OpenAdForm;
