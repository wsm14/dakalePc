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

// get 省公司列表  - 收益数据
export function fetchProvBeanDetail(params) {
  return request('/admin/cityOperationManagement/listStatisticCompanyBeanDetail', {
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

// post 省公司列表 - 修改帐号
export function fetchProvAccountEdit(data) {
  return request('/admin/company/account/updateCompanyAccount', {
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

// 区县运营中心 - 收益数据
export function fetchAreaBeanDetail(params) {
  return request('/admin/cityOperationManagement/listStatisticPartnerBeanDetail', {
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

// post 区县运营中心 - 帐号修改
export function fetchAreaAccountEdit(data) {
  return request('/admin/partner/account/updatePartnerAccount', {
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

// get 加盟申请 - 处理详情
export function fetchFranchiseHandleDetail(params) {
  return request('/admin/cityOperationManagement/getUserApplyById', {
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

// 销售管理系统帐号

// get 销售管理系统帐号 - 列表
export function fetchSaleAccountList(params) {
  return request('/admin/sell/main/listSellMain', {
    params,
  });
}

// get 销售管理系统帐号 - 详情
export function fetchSaleAccountDetail(params) {
  return request('/admin/sell/main/getSellMainDetail', {
    params,
  });
}

// post 销售管理系统帐号 - 新增
export function fetchSaleAccountAdd(data) {
  return request('/admin/sell/main/saveSellMain', {
    method: 'POST',
    data,
  });
}

// post 销售管理系统帐号 - 修改
export function fetchSaleAccountEdit(data) {
  return request('/admin/sell/main/updateSellMain', {
    method: 'POST',
    data,
  });
}

// 销售管理系统帐号 end
