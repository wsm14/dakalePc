import request from '@/utils/request';

// get 商户列表
export function fetchMerchantList(params) {
  return request('/admin/merchantManagement/listMerchant', {
    params,
  });
}

// get 商户详情
export function fetchMerchantDetail(params) {
  return request('/admin/merchantManagement/merchantCredentialsInfo', {
    params,
  });
}

// get 商户审核列表
export function fetchMerchantAuditList(params) {
  return request('/admin/merchantManagement/listMerchantVerify', {
    params,
  });
}

// get 商户审核详情
export function fetchMerchantAuditDetail(params) {
  return request('/admin/merchantManagement/getMerchantVerifyDetail', {
    params,
  });
}

// post 商家 店铺状态
export function fetchMerchantStatus(data) {
  return request('/admin/userManagement/fetchMerchantStatus', {
    method: 'POST',
    data,
  });
}

// post 商家 经营状态
export function fetchMerSaleStatus(data) {
  return request('/admin/userManagement/fetchMerchantStatus', {
    method: 'POST',
    data,
  });
}

// post 商家 审核
export function fetchMerSaleAudit(data) {
  return request('/admin/userMerchantVerify/updateUserMerchantVerifyStatusInfo', {
    method: 'POST',
    data,
  });
}
