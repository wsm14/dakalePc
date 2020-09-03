import React, { useState } from 'react';
import { connect } from 'dva';
import FormCondition from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';

const BusinessAddQuality = (props) => {
  const {
    dispatch,
    initialValues = { businessLicenseObject: { businessLicenseImg: '' } },
    form,
  } = props;
  const { businessLicenseObject: blimg = { businessLicenseImg: '' } } = initialValues;
  const [disabledInfo, setDisabledInfo] = useState(blimg && !blimg.businessLicenseImg);

  // 上传图片返回url ocr识别营业执照
  const fetchMerBusinessUpload = (file) => {
    setDisabledInfo(true);
    aliOssUpload(file).then((res) => {
      dispatch({
        type: 'businessList/fetchMerBusinessOcr',
        payload: {
          imageUrl: res.toString(),
        },
        callback: (val) => {
          form.setFieldsValue({
            businessLicenseObject: {
              businessLicenseImg: res.toString(),
              businessName: val.name,
              socialCreditCode: val.regNum,
              signInAddress: val.address,
              validityPeriod: val.validPeriod,
              businessScope: val.business,
            },
          });
          setDisabledInfo(false);
        },
      });
    });
  };

  const formItems = [
    {
      title: '02 资质信息',
      label: '营业执照',
      name: ['businessLicenseObject', 'businessLicenseImg'],
      type: 'upload',
      maxFile: 1,
      onChange: (file) => fetchMerBusinessUpload(file),
    },
    {
      label: '商户名称',
      disabled: disabledInfo,
      name: ['businessLicenseObject', 'businessName'],
    },
    {
      label: '统一社会信用代码',
      disabled: disabledInfo,
      name: ['businessLicenseObject', 'socialCreditCode'],
    },
    {
      label: '注册地址',
      disabled: disabledInfo,
      name: ['businessLicenseObject', 'signInAddress'],
    },
    {
      label: '营业期限',
      disabled: disabledInfo,
      name: ['businessLicenseObject', 'validityPeriod'],
    },
    {
      label: '经营范围',
      disabled: disabledInfo,
      type: 'textArea',
      name: ['businessLicenseObject', 'businessScope'],
    },
  ];

  return <FormCondition formItems={formItems} initialValues={initialValues} form={form} />;
};

export default connect()(BusinessAddQuality);
