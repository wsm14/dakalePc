import request from '@/utils/request';

// get 省级公司 - 列表
export function fetchProvComList(params) {
  return request('/admin/merchantManagement/listMerchant', {
    params,
  });
}

// get 省级公司 - 提现记录
export function fetchWithdrawList(params) {
  return request('/admin/merchantManagement/listMerchant', {
    params,
  });
}

// get 省级公司 - 收益数据
export function fetchIncomeDetail(params) {
  return request('/admin/merchantManagement/listMerchant', {
    params,
  });
}

// get 省级公司 - 获取公司详情
export function fetchProvComDetail(params) {
  return request('/admin/merchantManagement/listMerchant', {
    params,
  });
}

// post 省级公司 - 添加省级代理
export function fetchProvComAdd(data) {
  return request('/admin/userManagement/fetchMerchantStatus', {
    method: 'POST',
    data,
  });
}

// get 城市合伙人 - 列表
export function fetchCityPartnerList(params) {
  return request('/admin/cityOperationManagement/listPartner', {
    params,
  });
}

// post 城市合伙人 - 新增
export function fetchCityPartnerAdd(data) {
  return request('/admin/cityOperationManagement/savePartner', {
    method: 'POST',
    data,
  });
}

// get 加盟申请 - 列表
export function fetchFranchiseAppList(params) {
  return request('/admin/cityOperationManagement/listUserApply', {
    params,
  });
}

// post 加盟申请 - 处理
export function fetchFranchiseHandle(data) {
  return request('/admin/cityOperationManagement/updateUserApply', {
    method: 'POST',
    data,
  });
}
