import { checkCityName } from '@/utils/utils';

export const base = [
  {
    label: '集团名称',
    name: 'groupName',
  },
  {
    label: '集团ID',
    name: 'merchantGroupIdString',
  },
  {
    label: '经营类目',
    type: 'cascader',
    name: 'topCategoryName',
    render: (val) => val,
  },
  {
    label: '详细地址',
    name: 'address',
  },
  {
    label: '扫码付服务费（%）',
    name: 'scanCommissionRatio',
    render: (val) => (val || 0) + '%',
  },
  {
    label: '核销订单服务费（%）',
    name: 'commissionRatio',
    render: (val) => (val || 0) + '%',
  },
];

export const businessLicense = [
  {
    label: '营业执照',
    name: 'businessLicenseImg',
    type: 'upload',
  },
  {
    label: '社会信用代码',
    name: 'socialCreditCode',
  },
  {
    label: '公司名称',
    name: 'businessName',
  },
  {
    label: '注册地址',
    name: 'signInAddress',
  },
  {
    label: '营业期限',
    name: 'validityPeriod',
    render: (val, row) => `${row.establishDate || ''}-${val}`,
  },
  {
    label: '经营范围',
    name: 'businessScope',
    type: 'textArea',
  },
];

export const brand = [
  {
    label: '品牌',
    name: 'brandName',
  },
  {
    label: '品牌LOGO',
    name: 'brandLogo',
    type: 'upload',
  },
];

export const login = [{ label: '登录账号', name: 'account' }];

export const message = [
  {
    label: '联系人姓名',
    name: 'contactPerson',
  },
  {
    label: '联系人电话',
    name: 'contactMobile',
  },
];

export const shop = [
  {
    label: '店铺主图',
    name: 'mainImages',
    type: 'upload',
  },
  {
    label: '店铺小图',
    name: 'localImages',
    type: 'upload',
  },
  {
    label: '店铺介绍',
    name: 'groupDesc',
    type: 'textArea',
  },
];

export const legal = [
  {
    label: '法人身份证正面照',
    name: 'certFrontPhoto',
    type: 'upload',
  },
  {
    label: '法人身份证反面照',
    name: 'certReversePhoto',
    type: 'upload',
  },
  {
    label: '法人姓名',
    name: 'legalPerson',
  },
  {
    label: '法人身份证号码',
    name: 'legalCertId',
  },
  {
    label: '法人身份有效期',
    name: 'activeBeginDate',
  },
  {
    label: '法人手机号',
    name: 'legalMp',
  },
];

export const activeByOne = [
  {
    label: '开户许可证',
    name: 'openAccountPermit',
    type: 'upload',
  },
  {
    label: '开户名称',
    name: 'cardName',
  },
  {
    label: '银行卡号',
    name: 'cardNo',
  },
  {
    label: '开户银行',
    name: 'bankBranchName',
  },
  {
    label: '开户行号',
    name: 'bankSwiftCode',
  },
];

export const activeByBank = [
  {
    label: '银行卡',
    name: 'bankPhoto',
    type: 'upload',
  },
  {
    label: '银行卡号',
    name: 'cardNo',
  },
  {
    label: '开户支行',
    name: 'bankBranchName',
  },
  {
    label: '开户城市',
    name: 'areaCode',
    render: (val, row) => {
      return val ? checkCityName(val || '') : '';
    },
  },
  {
    label: '银行预留手机号',
    name: 'legalMp',
  },
  {
    label: '开户行号',
    name: 'bankSwiftCode',
  },
];

export const activeByLegal = [
  {
    label: '结算人身份证正面照',
    name: 'certFrontPhoto',
    type: 'upload',
  },
  {
    label: '结算人身份证反面照',
    name: 'certReversePhoto',
    type: 'upload',
  },
  {
    label: '结算人姓名',
    name: 'legalPerson',
  },
  {
    label: '结算人身份证号码',
    name: 'legalCertId',
  },
  {
    label: '结算人身份有效期',
    name: 'activeBeginDate',
  },
];
