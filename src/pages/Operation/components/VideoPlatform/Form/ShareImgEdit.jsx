import React from 'react';
import { WXFRIEND_SHARE_IMG } from '@/common/imgRatio';
import FormCondition from '@/components/FormCondition';

const ShareImg = (props) => {
  const { detail, form } = props;

  const formItems = [
    {
      label: '分享海报图',
      name: 'shareImg',
      type: 'upload',
      maxFile: 1,
      rules: [{ required: false }],
    },
    {
      label: '好友分享图',
      name: 'friendShareImg',
      type: 'upload',
      maxFile: 1,
      imgRatio: WXFRIEND_SHARE_IMG,
      rules: [{ required: false }],
      extra: '请上传比例为 5 * 4，大小128kb以内的jpg图片（375 * 300以上）',
    },
    {
      label: '自定义标题',
      name: 'customTitle',
      type: 'textArea',
      maxLength: 50,
      rows: 3,
      rules: [{ required: false }],
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default ShareImg;
