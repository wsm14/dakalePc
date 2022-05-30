import request from '@/utils/request';

// 供应商管理
// get 供应商管理 - 列表
export async function fetchGetSupplierManageList(params) {
  return request('/admin/supplier/pageListSupplier', {
    params,
  });
}

// get 供应商管理 - 详情
export async function fetchGetSupplierManageDetail(params) {
  return request('/admin/supplier/getSupplier', {
    params,
  });
}

// post 供应商管理 - 新增
export function fetchSupplierManageAdd(data) {
  return request('/admin/supplier/saveSupplier', {
    method: 'POST',
    data,
  });
}

// post 供应商管理 - 编辑
export function fetchSupplierManageEdit(data) {
  return request('/admin/supplier/updateSupplier', {
    method: 'POST',
    data,
  });
}

// post 供应商管理 - 对公激活
export function fetchSupplierCorpAccount(data) {
  return request('/admin/supplier/account/createSupplierCorpAccount', {
    method: 'POST',
    data,
  });
}

// post 供应商管理 - 对私激活
export function fetchSupplierPersonAccount(data) {
  return request('/admin/supplier/account/createSupplierPersonAccount', {
    method: 'POST',
    data,
  });
}

// post 供应商管理 - 禁用
export function fetchSupplierDisable(data) {
  return request('/admin/supplier/disableSupplier', {
    method: 'POST',
    data,
  });
}

// post 供应商管理 - 启用
export function fetchSupplierEnable(data) {
  return request('/admin/supplier/enableSupplier', {
    method: 'POST',
    data,
  });
}

// get 供应商管理 - 品牌 - 列表
export function fetchSupplierBrandList(params) {
  return request('/admin/supplier/brand/pageListSupplierBrand', {
    params,
  });
}

// get 供应商管理 - 品牌 - 详情
export function fetchSupplierBrandDetail(params) {
  return request('/admin/supplier/brand/getSupplierBrand', {
    params,
  });
}

// get 供应商管理 - 品牌 - 新增
export function fetchSupplierBrandAdd(data) {
  return request('/admin/supplier/brand/saveSupplierBrand', {
    method: 'POST',
    data,
  });
}

// get 供应商管理 - 品牌 - 修改
export function fetchSupplierBrandEdit(data) {
  return request('/admin/supplier/brand/updateSupplierBrand', {
    method: 'POST',
    data,
  });
}

// get 供应商管理 - 品牌 - 删除
export function fetchSupplierBrandDel(data) {
  return request('/admin/supplier/brand/deleteSupplierBrand', {
    method: 'POST',
    data,
  });
}

// 供应商管理 end

// 供应商审核
// get 供应商审核 - 列表
export async function fetchGetSupplierVerifyList(params) {
  return request('/admin/supplier/verify/pageListSupplierVerify', {
    params,
  });
}

// get 供应商审核 - 详情
export async function fetchGetSupplierVerifyDetail(params) {
  return request('/admin/supplier/verify/getSupplierVerify', {
    params,
  });
}

// post 供应商审核 - 通过
export function fetchSupplierVerifyAllow(data) {
  return request('/admin/supplier/verify/approvedSupplierVerify', {
    method: 'POST',
    data,
  });
}

// post 供应商审核 - 拒绝
export function fetchSupplierVerifyReject(data) {
  return request('/admin/supplier/verify/rejectSupplierVerify', {
    method: 'POST',
    data,
  });
}
// 供应商审核 end

// 结算明细
// get 结算明细 - 列表
export async function fetchGetSupplierSettlementList(params) {
  return request('/admin/supplier/settlement/pageListSupplierSettlement', {
    params,
  });
}

// get 结算明细 - 详情
export async function fetchGetSupplierSettlementDetail(params) {
  return request('/admin/supplier/settlement/getSupplierSettlement', {
    params,
  });
}

// post 结算明细 - 新增
export function fetchSupplierSettlementAdd(data) {
  return request('/admin/supplier/settlement/saveSupplierSettlement', {
    method: 'POST',
    data,
  });
}

// post 结算明细 - 修改
export function fetchSupplierSettlementEdit(data) {
  return request('/admin/supplier/settlement/updateSupplierSettlement', {
    method: 'POST',
    data,
  });
}
// 结算明细 end
