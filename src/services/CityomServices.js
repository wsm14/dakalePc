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
