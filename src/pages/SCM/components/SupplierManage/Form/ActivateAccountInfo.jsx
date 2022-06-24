import React from 'react';
import { connect } from 'umi';
import { PHONE_PATTERN } from '@/common/regExp';
import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';

/**
 * 对公对私激活表单
 */
const AccountInfo = ({ form, dispatch, loading, initialValues, bankAccount }) => {
  // 识别中不可修改
  const disabled = loading;

  // ocr 识别开户许可证
  const fetchGetOcr = (type, payload, callback) => {
    const api = {
      bankLicense: 'groupSet/fetchGetOcrBankLicense', // ocr 识别开户许可证
      bankCard: 'groupSet/fetchGetOcrIdBankCard', // ocr 识别银行卡
      idCardFront: 'groupSet/fetchGetOcrIdCardFront', // 识别省份证正面信息
      idCardBack: 'groupSet/fetchGetOcrIdCardBack', // 识别省份证反面信息
    }[type];
    dispatch({
      type: api,
      payload: payload,
      callback: (val) => callback(val),
    });
  };

  // 对公账户信息
  const formItems = [
    {
      title: '对公账户信息',
      label: '开户许可证',
      name: 'openAccountPermit',
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      disabled,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
          form.setFieldsValue({
            openAccountPermit: imgUrl[0],
          });
          fetchGetOcr('bankLicense', { imageUrl: imgUrl[0] }, (res) => {
            const { enterpriseNameCH = '', enterpriseBankId = '', enterpriseBankName } = res;
            form.setFieldsValue({
              cardName: enterpriseNameCH,
              bankBranchName: enterpriseBankName,
              cardNo: enterpriseBankId,
              city: undefined,
            });
          });
        }
      },
    },
    {
      label: '开户名称',
      name: 'cardName',
      disabled,
    },
    {
      label: '银行卡号',
      name: 'cardNo',
      disabled,
    },
    {
      label: '开户支行',
      name: 'bankBranchName',
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
      name: 'bankSwiftCode',
      rules: [{ required: false }],
    },
  ];

  // 对私账户信息
  const formItemsOwn = [
    {
      title: '对私账户信息',
      label: '银行卡',
      name: 'bankPhoto',
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      rules: [{ required: false }],
      extra: '以下信息通过OCR识别，请检查后再提交哦',
      disabled,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
          form.setFieldsValue({
            bankPhoto: imgUrl[0],
          });
          fetchGetOcr('idBankCard', { pic: imgUrl[0] }, (res) => {
            const { number, enterpriseBankName = '' } = res;
            form.setFieldsValue({
              [{ 1: 'cardNo', 2: 'cardId' }[bankAccount]]: number,
              bankBranchName: enterpriseBankName,
            });
          });
        }
      },
    },
    {
      label: '开户名称',
      name: 'cardName',
      hidden: bankAccount === '2',
      visible: bankAccount === '2',
    },
    {
      label: '银行卡号',
      name: { 1: 'cardNo', 2: 'cardId' }[bankAccount],
      disabled,
    },
    {
      label: '开户支行',
      name: 'bankBranchName',
    },
    {
      label: '开户城市',
      name: 'city',
      type: 'cascader',
      cityType: 'city',
    },
    {
      label: '银行预留手机号',
      name: { 1: 'legalMp', 2: 'telNo' }[bankAccount],
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
  ];

  const labelBefor = { 1: '法人', 2: '结算人' }[bankAccount];

  // 身份证信息
  const formItemsLegal = [
    {
      title: `${labelBefor}身份信息`,
      label: `${labelBefor}身份证正面照`,
      name: 'certFrontPhoto',
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      disabled,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
          form.setFieldsValue({ certFrontPhoto: imgUrl[0] });
          fetchGetOcr('idCardFront', { imageUrl: imgUrl[0] }, (res) => {
            const { name = '', num = '' } = res;
            form.setFieldsValue({
              legalPerson: name,
              cardName: name,
              [{ 1: 'legalCertId', 2: 'certId' }[bankAccount]]: num,
            });
          });
        }
      },
    },
    {
      label: `${labelBefor}身份证反面照`,
      name: 'certReversePhoto',
      type: 'upload',
      maxFile: 1,
      maxSize: 1024,
      disabled,
      onChange: async (val) => {
        let imgUrl = await aliOssUpload(val);
        if (imgUrl) {
          form.setFieldsValue({ certReversePhoto: imgUrl[0] });
          fetchGetOcr('idCardBack', { imageUrl: imgUrl[0] }, (res) => {
            let { startDate, endDate } = res;
            if (endDate == '长期' || !endDate) {
              endDate = '20991231';
            }
            form.setFieldsValue({
              activeBeginDate: [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
            });
          });
        }
      },
    },
    {
      label: `${labelBefor}姓名`,
      disabled,
      name: 'legalPerson',
    },
    {
      label: `${labelBefor}身份证号码`,
      disabled,
      name: { 1: 'legalCertId', 2: 'certId' }[bankAccount],
    },
    {
      label: `${labelBefor}身份有效期`,
      type: 'rangePicker',
      disabled,
      name: 'activeBeginDate',
    },
    {
      label: '法人手机号',
      name: 'legalMp',
      visible: bankAccount === '1',
      addRules: [{ pattern: PHONE_PATTERN, message: '手机号格式不正确' }],
    },
  ];

  // 补充描述和凭证
  const formOther = [
    {
      title: '补充描述和凭证',
      label: '补充描述',
      name: 'additionalDesc',
      type: 'textArea',
      maxLength: 200,
      rules: [{ required: false }],
    },
    {
      label: '凭证',
      name: 'additionalVoucher',
      type: 'upload',
      maxFile: 1,
      isCut: false,
      rules: [{ required: false }],
    },
  ];

  const formItemArr = {
    1: [...formItems, ...formItemsLegal], // 1 对公
    2: [...formItemsOwn, ...formItemsLegal, ...formOther], // 2 对私
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
