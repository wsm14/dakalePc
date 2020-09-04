import request from '@/utils/request';

// get 商户数据 - 商户列表
export function fetchMerchantList(params) {
  return request('/admin/merchantManagement/listMerchant', {
    params,
  });
}

// get 商户数据 - 商户详情
export function fetchMerchantDetail(params) {
  return request('/admin/merchantManagement/merchantCredentialsInfo', {
    params,
  });
}

// get 商户数据 - OCR识别营业执照
export function fetchMerBusinessOcr(params) {
  return request('/common/ocr/businessLicense', {
    params,
  });
}

// post 商户数据 - 商家 设置开户行号
export function fetchMerSetBandCode(data) {
  return request('/admin/merchantManagement/updateMerchantBankSwiftCode', {
    method: 'POST',
    data,
  });
}

// post 商户数据 - 商家新增
export function fetchMerchantAdd(data) {
  return request('/admin/userMerchantVerify/saveUserMerchantVerify', {
    method: 'POST',
    data,
  });
}

// post 商户数据 - 商家 设置
export function fetchMerchantSet(data) {
  return request('/admin/merchantManagement/updateMerchantBeanSet', {
    method: 'POST',
    data,
  });
}

// post 商户数据 - 商家 店铺状态 经营状态 修改
export function fetchMerchantStatus(data) {
  return request('/admin/merchantManagement/updateUserMerchant', {
    method: 'POST',
    data,
  });
}

// post 商户数据 - 设置商家端验证码
export function fetchMerVerificationCodeSet(data) {
  return request('/admin/merchantManagement/setMerchantLogonCode', {
    method: 'POST',
    data,
  });
}

// get 商户审核 - 商户审核列表
export function fetchMerchantAuditList(params) {
  return request('/admin/merchantManagement/listMerchantVerify', {
    params,
  });
}

// get 商户审核 - 商户审核详情
export function fetchMerchantAuditDetail(params) {
  return request('/admin/merchantManagement/getMerchantVerifyDetail', {
    params,
  });
}

// post 商户审核 - 商家 审核通过
export function fetchMerSaleAuditAllow(data) {
  return request('/admin/userMerchantVerify/updateUserMerchantVerifyStatusInfo', {
    method: 'POST',
    data,
  });
}

// post 商户审核 - 商家 审核拒绝
export function fetchMerSaleAudit(data) {
  return request('/admin/userMerchantVerify/updateUserMerchantVerifyStatusInfo', {
    method: 'POST',
    data,
  });
}

// get 品牌 - 品牌列表
export function fetchMerBrandList(params) {
  return request('/admin/merchantManagement/listConfigBrand', {
    params,
  });
}

// post 品牌 - 品牌新增
export function fetchMerBrandAdd(data) {
  return request('/admin/merchantManagement/saveConfigBrand', {
    method: 'POST',
    data,
  });
}

// get 注册列表 - 列表
export function fetchMerRegisterList(params) {
  return request('/admin/merchantManagement/listMerchantUnVerified', {
    params,
  });
}

// get 视屏列表 - 列表
export function fetchMerVideoList(params) {
  return request('/admin/marketingManagement/listMerchantMoment', {
    params,
  });
}

// post 视屏列表 - 删除
export function fetchMerVideoDel(data) {
  return request('/admin/merchantManagement/saveConfigBrand', {
    method: 'POST',
    data,
  });
}
