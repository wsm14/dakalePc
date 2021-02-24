import React from 'react';
import { MSG_PSUH_TYPE, MSG_PSUH_OBJECT, MSG_PSUH_URL, MSG_PSUH_TAB } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const MessagePushSet = (props) => {
  const { initialValues = {}, form } = props;

  const formItems = [
    {
      label: '推送目标',
      name: 'userType',
      type: 'radio',
      select: MSG_PSUH_TAB,
    },
    {
      label: '消息标题',
      name: 'title',
      maxLength: 20,
    },
    {
      label: '消息内容',
      name: 'content',
      type: 'textArea',
    },
    {
      label: '跳转类型',
      name: 'linkType',
      type: 'radio',
      select: [
        { name: '无', value: '' },
        ...Object.keys(MSG_PSUH_URL).map((item) => ({ name: MSG_PSUH_URL[item], value: item })),
      ],
      rules: [{ required: false }],
    },
    {
      label: '跳转连接',
      name: 'link',
      rules: [{ required: false }],
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
      showTime: true,
    },
    {
      label: '推送对象',
      name: 'pushObjectType',
      type: 'radio',
      select: MSG_PSUH_OBJECT,
    },
  ];

  return (
    <FormCondition form={form} formItems={formItems} initialValues={initialValues}></FormCondition>
  );
};

export default MessagePushSet;
