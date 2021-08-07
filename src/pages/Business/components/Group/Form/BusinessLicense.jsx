import React from 'react';
import { connect } from 'umi';
import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';

/**
 * 营业执照信息
 * @returns
 */
const BusinessLicense = ({ form, dispatch, loading, initialValues }) => {
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
      businessLicenseObject: {
        businessLicenseImg: '',
        socialCreditCode: '',
        businessName: '',
        signInAddress: '',
        businessScope: '',
      },
      activeValidity: [],
    });
  };

  const formItems = [
    {
      title: '02 营业执照信息',
      label: '营业执照',
      name: ['businessLicenseObject', 'businessLicenseImg'],
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      disabled,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
          closeBusinessInfo();
          fetchGetOcrBusinessLicense({ imageUrl: imgUrl[0] }, (res) => {
            const { address, business, establishDate, name, regNum, validPeriod } = res;
            form.setFieldsValue({
              businessLicenseObject: {
                businessLicenseImg: imgUrl[0],
                socialCreditCode: regNum || '',
                businessName: name || '',
                signInAddress: address || '',
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
      label: '社会信用代码',
      name: ['businessLicenseObject', 'socialCreditCode'],
      disabled,
    },
    {
      label: '公司名称',
      name: ['businessLicenseObject', 'businessName'],
      disabled,
    },
    {
      label: '注册地址',
      name: ['businessLicenseObject', 'signInAddress'],
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
      name: ['businessLicenseObject', 'businessScope'],
      disabled,
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ loading }) => ({
  loading: loading.effects['groupSet/fetchGetOcrBusinessLicense'],
}))(BusinessLicense);
