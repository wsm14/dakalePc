import React, { useState } from 'react';
import { connect } from 'umi';
import { MSG_PSUH_TYPE, MSG_PSUH_OBJECT } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const MarketActivityBaseForm = (props) => {
  const { initialValues = {}, form, dispatch, userType = '' } = props;

  const [pushObj, setPushObj] = useState('all');

  const formItems = [
    {
      label: '活动名称',
      name: 'title',
      maxLength: 15,
    },
    {
      label: '消息内容',
      name: 'content',
      type: 'textArea',
    },

    {
      label: '消息类型',
      name: 'messageType',
      type: 'select',
      select: MSG_PSUH_TYPE,
    },
    {
      label: '推送时间',
      name: 'pushTime',
      type: 'dataPicker',
      format: 'YYYY-MM-DD HH:mm',
      showTime: true,
    },
    {
      label: '推送对象',
      name: 'pushObjectType',
      type: 'radio',
      select: userType == 'user' ? MSG_PSUH_OBJECT : { all: '全部用户' },
      onChange: (e) => {
        setPushObj(e.target.value);
      },
    },
  ];

  return (
    <>
      <FormCondition
        form={form}
        formItems={formItems}
        initialValues={initialValues}
      ></FormCondition>
    </>
  );
};

export default connect(({ baseData }) => ({
  experLevel: baseData.experLevel,
}))(MarketActivityBaseForm);
