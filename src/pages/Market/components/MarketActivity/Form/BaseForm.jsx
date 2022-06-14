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
      label: '活动时间',
      name: 'content',
      type: 'textArea',
    },

    {
      label: '活动规则',
      name: 'messageType',
      type: 'select',
      select: MSG_PSUH_TYPE,
    },
    {
      label: '活动备注',
      name: 'pushTime',
      type: 'dataPicker',
      format: 'YYYY-MM-DD HH:mm',
      showTime: true,
    },
    {
      label: '使用规则',
      name: 'pushObjectType',
      type: 'radio',
      select: userType == 'user' ? MSG_PSUH_OBJECT : { all: '全部用户' },
      onChange: (e) => {
        setPushObj(e.target.value);
      },
    },
    {
      label: '使用备注',
      name: 'pushObjectType',
      type: 'radio',
      select: userType == 'user' ? MSG_PSUH_OBJECT : { all: '全部用户' },
      onChange: (e) => {
        setPushObj(e.target.value);
      },
    },
    {
      label: '活动链接',
      name: 'pushObjectType',
      addRules: [
        {
          type: 'url',
          message: '请输入正确链接格式',
        },
      ],
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
