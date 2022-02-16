import React from 'react';
import { connect } from 'umi';
import { VIDEO_ADVERT } from '@/common/imgRatio';
import FormCondition from '@/components/FormCondition';

/**
 * 带货修改
 */
const GoodsEdit = (props) => {
  const { form, detail, tradeList } = props;

  const formItems = [
    {
      label: '上传封面',
      name: 'frontImage',
      type: 'upload',
      maxFile: 1,
      maxSize: 500,
      imgRatio: VIDEO_ADVERT,
    },
    {
      label: '上传视频',
      name: 'videoUrl',
      type: 'videoUpload',
      maxFile: 1,
      onChange: ({ file }) => {
        const fileurl = URL.createObjectURL(file);
        // 获取视频的时长 长宽高
        const videoElement = document.createElement('video');
        videoElement.addEventListener('loadedmetadata', function (_event) {
          const duration = videoElement.duration; // 单位：秒
          form.setFieldsValue({
            length: parseInt(duration),
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
      hidden: true,
      rules: [{ required: false }],
    },
    {
      label: '视频时长',
      name: 'length',
      hidden: true,
    },
    {
      label: '分享内容',
      name: 'message',
      type: 'textArea',
      maxLength: 50,
    },
    {
      label: '行业分类',
      type: 'cascader',
      name: 'categoryNode',
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'categoryDTOList' },
      onChange: (val) => {
        form.setFieldsValue({
          topCategoryId: val[0],
          categoryId: val[1],
        });
      },
    },
    {
      name: 'topCategoryId', // 一级行业id
      hidden: true,
    },
    {
      name: 'categoryId', // 二级行业id
      hidden: true,
    },
  ];

  return <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>;
};

export default connect(({ sysTradeList }) => ({
  tradeList: sysTradeList.list.list,
}))(GoodsEdit);
