import React from 'react';
import { connect } from 'umi';
import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import { PHONE_PATTERN } from '@/common/regExp';
import FormCondition from '@/components/FormCondition';

/**
 * 对公对私表单
 */
const AccountInfo = ({ form, dispatch, loading, initialValues, bankAccount }) => {
  // 识别中不可修改
  const disabled = loading;

  // ocr 识别开户许可证
  const fetchGetOcrBankLicense = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrBankLicense',
      payload: payload,
      callback: (val) => callback(val),
    });
  };

  // ocr 识别银行卡
  const fetchGetOcrIdBankCard = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrIdBankCard',
      payload: payload,
      callback: (val) => callback(val),
    });
  };

  // 识别省份证正面信息
  const fetchGetOcrIdCardFront = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrIdCardFront',
      payload: payload,
      callback: (val) => callback(val),
    });
  };
  // 识别省份证反面信息
  const fetchGetOcrIdCardBack = (payload, callback) => {
    dispatch({
      type: 'groupSet/fetchGetOcrIdCardBack',
      payload: payload,
      callback: (val) => callback(val),
    });
  };

  // 对公账户信息
  const formItems = [
    {
      title: '对公账户信息',
      label: '开户许可证',
      name: ['bankBindingInfo', 'openAccountPermit'],
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      disabled,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
          fetchGetOcrBankLicense({ imageUrl: imgUrl[0] }, (res) => {
            const { enterpriseNameCH = '', enterpriseBankId = '', enterpriseBankName } = res;
            form.setFieldsValue({
              bankBindingInfo: {
                openAccountPermit: imgUrl[0],
                cardName: enterpriseNameCH,
                bankBranchName: enterpriseBankName,
                cardNo: enterpriseBankId,
              },
              city: undefined,
            });
          });
        }
      },
    },
    {
      label: '开户名称',
      name: ['bankBindingInfo', 'cardName'],
      disabled,
    },
    {
      label: '银行卡号',
      name: ['bankBindingInfo', 'cardNo'],
      disabled,
    },
    {
      label: '开户支行',
      name: ['bankBindingInfo', 'bankBranchName'],
      disabled,
    },
    {
      label: '开户支行城市',
      name: 'city',
      type: 'cascader',
      cityType: 'city',
    },
    {
      label: '开户行号',
      name: ['bankBindingInfo', 'bankSwiftCode'],
      rules: [{ required: false }],
    },
  ];

  // 对私账户信息
  const formItemsOwn = [
    {
      title: '对私账户信息',
      label: '银行卡',
      name: ['bankBindingInfo', 'bankPhoto'],
      type: 'upload',
      maxSize: 1,
      maxFile: 1024,
      rules: [{ required: false }],
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      disabled,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
          fetchGetOcrIdBankCard({ pic: imgUrl[0] }, (res) => {
            const { number, enterpriseBankName = '' } = res;
            form.setFieldsValue({
              bankBindingInfo: {
                bankPhoto: imgUrl[0],
                cardNo: number,
                bankBranchName: enterpriseBankName,
              },
            });
          });
        }
      },
    },
    {
      label: '银行卡号',
      name: ['bankBindingInfo', 'cardNo'],
      disabled,
    },
    {
      label: '开户支行',
      name: ['bankBindingInfo', 'bankBranchName'],
    },
    {
      label: '开户城市',
      name: 'city',
      type: 'cascader',
      cityType: 'city',
    },
    {
      label: '银行预留手机号',
      name: ['bankBindingInfo', 'legalMp'],
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
    {
      label: '开户行号',
      name: ['bankBindingInfo', 'bankSwiftCode'],
      rules: [{ required: false }],
    },
  ];

  const labelBefor = { 1: '法人', 2: '结算人' }[bankAccount];

  // 身份证信息
  const formItemsLegal = [
    {
      title: `${labelBefor}身份信息`,
      label: `${labelBefor}身份证正面照`,
      name: ['bankBindingInfo', 'certFrontPhoto'],
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      disabled,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
          fetchGetOcrIdCardFront({ imageUrl: imgUrl[0] }, (res) => {
            const { name = '', num = '' } = res;
            form.setFieldsValue({
              bankBindingInfo: { certFrontPhoto: imgUrl[0], legalPerson: name, legalCertId: num },
            });
          });
        }
      },
    },
    {
      label: `${labelBefor}身份证反面照`,
      name: ['bankBindingInfo', 'certReversePhoto'],
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      disabled,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
          fetchGetOcrIdCardBack({ imageUrl: imgUrl[0] }, (res) => {
            let { startDate, endDate } = res;
            if (endDate == '长期' || !endDate) {
              endDate = '20991231';
            }
            form.setFieldsValue({
              bankBindingInfo: {
                certReversePhoto: imgUrl[0],
              },
              activeBeginDate: [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
            });
          });
        }
      },
    },
    {
      label: `${labelBefor}姓名`,
      disabled,
      name: ['bankBindingInfo', 'legalPerson'],
    },
    {
      label: `${labelBefor}身份证号码`,
      disabled,
      name: ['bankBindingInfo', 'legalCertId'],
    },
    {
      label: `${labelBefor}身份有效期`,
      type: 'rangePicker',
      disabled,
      name: 'activeBeginDate',
    },
    {
      label: '法人手机号',
      name: ['bankBindingInfo', 'legalMp'],
      visible: bankAccount === '1',
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
  ];

  const formItemArr = {
    1: [...formItems, ...formItemsLegal],
    2: [...formItemsOwn, ...formItemsLegal],
  }[bankAccount];

  return <FormCondition formItems={formItemArr} form={form} initialValues={initialValues} />;
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['groupSet/fetchGetOcrBankLicense'] ||
    loading.effects['groupSet/fetchGetOcrIdBankCard'] ||
    loading.effects['groupSet/fetchGetOcrIdCardFront'] ||
    loading.effects['groupSet/fetchGetOcrIdCardBack'],
}))(AccountInfo);
