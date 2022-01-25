import React from 'react';
import { connect } from 'umi';
import FormCondition from '@/components/FormCondition';

const PlatformVideoSet = (props) => {
  const { form, initialValues } = props;

  // 信息
  const formItems = [
    {
      label: '首刷视频',
      name: 'url',
      type: 'videoUpload',
      maxFile: 1,
      // rules: [{ required: false }],
      onChange: ({ file }) => {
        const fileurl = URL.createObjectURL(file);
        // 获取视频的时长 长宽高
        const videoElement = document.createElement('video');
        videoElement.addEventListener('loadedmetadata', function (_event) {
          form.setFieldsValue({
            videoId: undefined,
          });
        });
        videoElement.src = fileurl;
        videoElement.load();
      },
    },
    {
      label: '视频id',
      name: 'videoId',
      rules: [{ required: false }],
      hidden: true,
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

export default connect(({}) => ({}))(PlatformVideoSet);
