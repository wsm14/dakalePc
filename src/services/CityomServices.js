import request from '@/utils/request';

// 省公司列表

// get 省公司列表 - 列表
export function fetchProvList(params) {
  return request('/admin/company/listCompany', {
    params,
  });
}

// get 省公司列表 - 详情
export function fetchProvDetail(params) {
  return request('/admin/company/companyDetail', {
    params,
  });
}

// get 省公司列表 - 银行卡详情
export function fetchProvBankDetail(params) {
  return request('/admin/bankBindingInfo/getBankBindingInfo', {
    params,
  });
}

// post 省公司列表 - 新增
export function fetchProvAdd(data) {
  return request('/admin/company/saveCompany', {
    method: 'POST',
    data,
  });
}

// post 省公司列表 - 修改
export function fetchProvEdit(data) {
  return request('/admin/company/updateCompany', {
    method: 'POST',
    data,
  });
}

// post 省公司列表 - 设置修改银行卡详情
export function fetchProvBankSet(data) {
  return request('/admin/company/submitBankBindingInfo', {
    method: 'POST',
    data,
  });
}

// 省公司列表 end

// 区县运营中心

// 区县运营中心 - 列表
export function fetchAreaCenterList(params) {
  return request('/admin/partner/listPartner', {
    params,
  });
}

// get 区县运营中心 - 详情
export function fetchAreaDetail(params) {
  return request('/admin/partner/getPartnerDetail', {
    params,
  });
}

// get 区县运营中心 - 银行卡详情
export function fetchAreaBankDetail(params) {
  return request('/admin/bankBindingInfo/getBankBindingInfo', {
    params,
  });
}

// post 区县运营中心 - 新增
export function fetchAreaAdd(data) {
  return request('/admin/partner/savePartner', {
    method: 'POST',
    data,
  });
}

// post 区县运营中心 - 修改
export function fetchAreaEdit(data) {
  return request('/admin/partner/updatePartner', {
    method: 'POST',
    data,
  });
}

// post 区县运营中心 - 设置修改银行卡详情
export function fetchAreaBankSet(data) {
  return request('/admin/partner/submitBankBindingInfo', {
    method: 'POST',
    data,
  });
}

// 区县运营中心 end

// 加盟申请

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

// 加盟申请 end
