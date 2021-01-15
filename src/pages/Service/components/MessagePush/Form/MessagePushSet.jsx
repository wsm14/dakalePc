import React from 'react';
import {
  MSG_PSUH_TYPE,
  MSG_PSUH_OBJECT,
  MSG_PSUH_STATUS,
  MSG_PSUH_URL,
  MSG_PSUH_TAB,
} from '@/common/constant';
import FormCondition from '@/components/FormCondition';

const MessagePushSet = (props) => {
  const { initialValues = {}, form } = props;

  const formItems = [
    {
      label: '推送状态',
      name: 'pushStatus',
      render: (val) => MSG_PSUH_STATUS[val],
    },
    {
      label: '推送目标',
      name: 'userType',
      render: (val) => MSG_PSUH_TAB[val],
    },
    {
      label: '消息标题',
      name: 'title',
    },
    {
      label: '消息内容',
      name: 'content',
    },
    {
      label: '跳转链接',
      name: 'linkType',
      render: (val, row) => MSG_PSUH_URL[val] + ' ' + row.link,
    },
    {
      label: '消息类型',
      name: 'messageType',
      render: (val) => MSG_PSUH_TYPE[val],
    },
    {
      label: '推送时间',
      name: 'pushTime',
    },
    {
      label: '推送对象',
      name: 'pushObjectType',
      render: (val) => MSG_PSUH_OBJECT[val],
    },
  ];

  return (
    <FormCondition form={form} formItems={formItems} initialValues={initialValues}></FormCondition>
  );
};

export default MessagePushSet;
