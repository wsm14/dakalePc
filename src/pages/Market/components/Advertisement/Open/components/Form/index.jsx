import React, { useState } from 'react';
import moment from 'moment';
import { OPEN_ADVERT_TYPE } from '@/common/constant';
import { OPEN_ADVERT } from '@/common/imgRatio';
import { NativeFormSet } from '@/components/FormListCondition';
import FormCondition from '@/components/FormCondition';

const OpenAdForm = (props) => {
  const { detail, form, tabKey } = props;

  const [mediaType, setMediaType] = useState('user');

  const formItems = [
    {
      label: '广告主名',
      name: 'launchOwner',
      maxLength: 20,
    },
    {
      label: '广告类型',
      type: 'radio',
      name: 'mediaType',
      select: OPEN_ADVERT_TYPE,
      onChange: (e) => setMediaType(e.target.value),
    },
    {
      label: '广告上传',
      type: 'upload',
      name: 'url',
      maxFile: 1,
      visible: mediaType === 'image',
      imgRatio: OPEN_ADVERT,
    },
    {
      label: '上传封面',
      name: ['videoContentObject', 'frontImage'],
      type: 'upload',
      maxFile: 1,
      maxSize: 500,
      visible: mediaType === 'video',
      imgRatio: VIDEO_ADVERT,
    },
    {
      label: '上传视频',
      name: 'videoUrl',
      type: 'videoUpload',
      maxFile: 1,
      visible: mediaType === 'video',
      onChange: ({ file }) => {
        const fileurl = URL.createObjectURL(file);
        // 获取视频的时长 长宽高
        const videoElement = document.createElement('video');
        videoElement.addEventListener('loadedmetadata', function (_event) {
          const duration = videoElement.duration; // 单位：秒
          form.setFieldsValue({
            videoContentObject: { videoId: undefined, length: parseInt(duration) },
          });
        });
        videoElement.src = fileurl;
        videoElement.load();
      },
    },
    {
      label: '视频id',
      name: ['videoContentObject', 'videoId'],
      visible: mediaType === 'video',
      rules: [{ required: false }],
      hidden: true,
    },
    {
      label: '视频时长',
      visible: mediaType === 'video',
      name: ['videoContentObject', 'length'],
      hidden: true,
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
      formItem: <NativeFormSet form={form} detail={detail} port={tabKey}></NativeFormSet>,
    },
  ];

  return <FormCondition initialValues={detail} formItems={formItems} form={form} />;
};

export default OpenAdForm;
