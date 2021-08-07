import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { BRAND_VIDEO_ADVERT } from '@/common/imgRatio';
import { SPACE_PATTERN, WORD_NUM_PATTERN } from '@/common/regExp';
import PopImgShow from '@/components/PopImgShow';
import BrandUpdate from '@/pages/Base/components/Brand/BrandUpdate';
import FormCondition from '@/components/FormCondition';

/**
 * 品牌信息 && 登录信息 && 联系人信息 && 店铺信息
 */
const OhterInfoForm = ({ form, list, formType, loading, dispatch, initialValues }) => {
  const [bandImg, setBandImg] = useState({ show: false, url: '' });
  const [brandSet, setBrandSet] = useState({ show: false, url: '' });
  const [videoImg, setVideoImg] = useState(false);

  // 创建品牌
  const handleShowBrandSet = () =>
    setBrandSet({
      type: 'add',
      show: true,
      initialValues: { categoryId: initialValues.topCategoryId },
    });

  // 获取品牌信息
  useEffect(() => {
    fetchMasterManagementList();
  }, []);

  useEffect(() => {
    if (initialValues.brandLogo) {
      setBandImg({ show: true, url: initialValues.brandLogo });
    }
  }, [initialValues]);

  // 获取品牌列表
  const fetchMasterManagementList = () => {
    dispatch({
      type: 'businessBrand/fetchGetList',
      payload: {
        page: 1,
        limit: 999,
      },
    });
  };

  const formItems = [
    {
      title: '03 联系人信息',
      label: '联系人姓名',
      name: 'contactPerson',
    },
    {
      label: '联系人电话',
      name: 'contactMobile',
    },
    {
      title: '04 登录信息',
      label: '登录账号',
      name: 'account',
      maxLength: 30,
      disabled: formType === 'edit',
      addRules: [{ pattern: !SPACE_PATTERN, message: '账号格式不正确' }],
    },
    {
      label: '登录密码',
      name: 'password',
      maxLength: 16,
      visible: formType === 'add',
      addRules: [{ pattern: WORD_NUM_PATTERN, message: '密码格式不正确' }],
    },
    {
      title: '05 品牌信息',
      label: '品牌',
      name: 'brandId',
      type: 'select',
      select: list,
      allowClear: true,
      loading,
      suffix: <a onClick={handleShowBrandSet}>创建品牌</a>,
      onChange: (e, value) => {
        form.setFieldsValue({
          brandName: value?.option?.brandName || undefined,
          brandLogo: value?.option?.brandLogo || undefined,
        });
        setBandImg({ show: value?.option ? true : false, url: value?.option?.brandLogo });
      },
      fieldNames: { label: 'brandName', value: 'configBrandIdString' },
    },
    {
      type: 'noForm',
      visible: bandImg.show,
      formItem: (
        <div style={{ marginLeft: 84, marginBottom: 10, display: 'flex', alignItems: 'center' }}>
          品牌LOGO:{' '}
          <div style={{ marginLeft: '10px' }}>
            <PopImgShow url={bandImg.url}></PopImgShow>
          </div>
        </div>
      ),
    },
    {
      label: '品牌宣传图片',
      name: 'brandPublicityImage',
      type: 'upload',
      maxFile: 9,
      extra: '建议尺寸 16:9，图片大小3M以内',
    },
    {
      label: '品牌宣传视频封面',
      name: 'frontImage',
      type: 'upload',
      maxFile: 1,
      imgRatio: BRAND_VIDEO_ADVERT,
      rules: [{ required: videoImg }],
    },
    {
      label: '品牌宣传视频',
      name: 'videoUrl',
      type: 'videoUpload',
      maxFile: 1,
      rules: [{ required: false }],
      onRemove: () => setVideoImg(false),
      onChange: ({ file }) => {
        setVideoImg(true);
        const fileurl = URL.createObjectURL(file);
        // 获取视频的时长 长宽高
        const videoElement = document.createElement('video');
        videoElement.addEventListener('loadedmetadata', function (_event) {
          const duration = videoElement.duration; // 单位：秒
          form.setFieldsValue({
            length: parseInt(duration),
            videoId: undefined,
            videoContentOb: { height: videoElement.videoHeight, width: videoElement.videoWidth },
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
    {
      label: '视频宽度',
      name: ['videoContentOb', 'height'],
      hidden: true,
      rules: [{ required: false }],
    },
    {
      label: '视频高度',
      name: ['videoContentOb', 'width'],
      hidden: true,
      rules: [{ required: false }],
    },
    {
      label: '视频时长',
      name: 'length',
      hidden: true,
      rules: [{ required: false }],
    },
    {
      label: '品牌故事',
      name: 'brandStory',
      type: 'textArea',
      maxLength: 500,
      rules: [{ required: false }],
    },
    {
      label: '品牌名称',
      name: 'brandName',
      hidden: true,
    },
    {
      label: '品牌名称',
      name: 'brandLogo',
      hidden: true,
    },
    {
      title: '06 店铺信息（上传后将同步至各店铺）',
      label: '店铺头图',
      name: 'mainImages',
      type: 'upload',
      maxFile: 1,
    },
    {
      label: '店铺环境图',
      name: 'localImages',
      type: 'upload',
      maxFile: 9,
      extra: '至少3张，建议尺寸 16:9，图片大小3M以内',
      addRules: [
        {
          validator: (rule, value) => {
            if (typeof value === 'string') {
              return Promise.resolve();
            }
            if (!value) {
              return Promise.resolve();
            }
            const { fileList } = value;
            if (fileList.length < 3) {
              return Promise.reject('至少上传 3 张图');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '店铺介绍',
      name: 'groupDesc',
      type: 'textArea',
      maxLength: 200,
      rules: [{ required: false }],
    },
  ];

  return (
    <>
      <FormCondition formItems={formItems} form={form} initialValues={initialValues} />
      <BrandUpdate
        cRef={{ current: { fetchGetData: fetchMasterManagementList } }}
        visible={brandSet}
        onClose={() => setBrandSet(false)}
      ></BrandUpdate>
    </>
  );
};

export default connect(({ loading, businessBrand }) => ({
  list: businessBrand.list,
  loading: loading.models.businessBrand,
}))(OhterInfoForm);
