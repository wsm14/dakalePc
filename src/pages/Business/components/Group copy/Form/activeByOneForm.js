import React from 'react';
import { connect } from 'umi';
import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';

const activeForm = ({ form, initialValues, dispatch, formType }) => {
  const fetchGetOcrBusinessLicense = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrBusinessLicense',
      payload: payload,
      callback: (val) => callback(val),
    });
  };

  const formItems = [
    {
      label: '营业执照',
      name: ['businessLicenseObject', 'businessLicenseImg'],
      type: 'upload',
      maxSize: 1,
      maxFile: 1,
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      disabled: formType === 'edit',
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
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
      disabled: formType === 'edit',
    },
    {
      label: '公司名称',
      name: ['businessLicenseObject', 'businessName'],
      disabled: formType === 'edit',
    },
    {
      label: '注册地址',
      name: ['businessLicenseObject', 'signInAddress'],
      disabled: formType === 'edit',
    },
    {
      label: '营业期限',
      type: 'rangePicker',
      name: 'activeValidity',
      // disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
      disabled: formType === 'edit',
    },
    {
      label: '经营范围',
      type: 'textArea',
      name: ['businessLicenseObject', 'businessScope'],
      // rules: [{ required: true, message: `请确认店铺门头照` }],
      disabled: formType === 'edit',
    },
  ];

  return <FormCondition formItems={formItems} form={form} initialValues={initialValues} />;
};

export default connect(({ groupSet }) => ({
  ...groupSet,
}))(activeForm);
