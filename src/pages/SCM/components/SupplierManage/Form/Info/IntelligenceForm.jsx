import React from 'react';
import { connect } from 'umi';
import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';

/**
 * 资质信息
 */
const IntelligenceForm = ({ form, dispatch, loading, initialValues }) => {
  const { bankStatus } = initialValues;
  // 激活成功不可修改
  const disabled = loading || bankStatus === '3';

  // ocr 识别
  const fetchGetOcrBusinessLicense = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrBusinessLicense',
      payload: payload,
      callback: (val) => callback(val),
    });
  };

  // 清空营业执照信息
  const closeBusinessInfo = () => {
    form.setFieldsValue({
      proofInfoObject: {
        businessLicenseImg: '',
        socialCreditCode: '',
        businessName: '',
        signInAddress: '',
        businessScope: '',
      },
      activeValidity: [],
    });
  };

  const fetchUploadImg = async (val, key) => {
    let imgUrl = await aliOssUpload(val);
    if (imgUrl) {
      form.setFieldsValue({
        proofInfoObject: {
          [key]: imgUrl.toString(),
        },
      });
    }
  };

  const formItems = [
    {
      title: '04 供应商资质',
      label: '营业执照',
      name: ['proofInfoObject', 'businessLicenseImg'],
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      disabled,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
          closeBusinessInfo();
          form.setFieldsValue({
            proofInfoObject: {
              businessLicenseImg: imgUrl[0],
            },
          });
          fetchGetOcrBusinessLicense({ imageUrl: imgUrl[0] }, (res) => {
            const { address, business, establishDate, name, regNum, validPeriod, person } = res;
            form.setFieldsValue({
              proofInfoObject: {
                socialCreditCode: regNum || '',
                businessName: name || '',
                signInAddress: address || '',
                legalPerson: person || '',
                businessScope: business || '',
              },
              activeValidity: [
                moment(establishDate, 'YYYY-MM-DD'),
                moment(validPeriod, 'YYYY-MM-DD'),
              ],
            });
          });
        }
      },
    },
    {
      label: '公司名称',
      name: ['proofInfoObject', 'businessName'],
      disabled,
    },
    {
      label: '社会信用代码',
      name: ['proofInfoObject', 'socialCreditCode'],
      disabled,
    },
    {
      label: '注册地址',
      name: ['proofInfoObject', 'signInAddress'],
      disabled,
    },
    {
      label: '营业期限',
      type: 'rangePicker',
      name: 'activeValidity',
      disabled,
    },
    {
      label: '经营范围',
      type: 'textArea',
      name: ['proofInfoObject', 'businessScope'],
      disabled,
    },
    {
      label: '法人代表',
      name: ['proofInfoObject', 'legalPerson'],
      rules: [{ required: false }],
      disabled,
    },
    {
      label: '授权证书',
      name: ['proofInfoObject', 'authorizeImg'],
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      extra: '指该供应商授权和“哒卡乐”的证书',
      onChange: async (val) => {
        await fetchUploadImg(val, 'authorizeImg');
      },
    },
    {
      label: '生产/经营许可证',
      name: ['proofInfoObject', 'productLicense'],
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      rules: [{ required: false }],
      onChange: async (val) => {
        await fetchUploadImg(val, 'productLicense');
      },
    },
    {
      label: '体系认证',
      name: ['proofInfoObject', 'systemApprove'],
      type: 'upload',
      multiple: true,
      rules: [{ required: false }],
    },
    {
      label: '产品认证',
      name: ['proofInfoObject', 'productApprove'],
      type: 'upload',
      multiple: true,
      rules: [{ required: false }],
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ loading }) => ({
  loading: loading.effects['groupSet/fetchGetOcrBusinessLicense'],
}))(IntelligenceForm);
