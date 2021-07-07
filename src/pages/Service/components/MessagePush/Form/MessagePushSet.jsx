import React from 'react';
import { MSG_PSUH_TYPE, MSG_PSUH_OBJECT } from '@/common/constant';
import { NativeFormSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';

const MessagePushSet = (props) => {
  const { initialValues = {}, form } = props;
  const { linkType, link = '', ...ohter } = initialValues;
  const newDetail = {
    ...ohter,
    jumpUrl: link,
    jumpUrlType: { '': '无', h5: 'H5', native: 'inside' }[linkType],
  };

  const formItems = [
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
      type: 'noForm',
      formItem: (
        <NativeFormSet form={form} detail={newDetail}></NativeFormSet>
      ),
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
      select: MSG_PSUH_OBJECT,
    },
  ];

  return (
    <FormCondition form={form} formItems={formItems} initialValues={newDetail}></FormCondition>
  );
};

export default MessagePushSet;
