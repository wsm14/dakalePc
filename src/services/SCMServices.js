import request from '@/utils/request';

// get 供应商审核 - 列表
export async function fetchGetSupplierVerifyList(params) {
  return request('/admin/supplier/verify/pageListSupplierVerify', {
    params,
  });
}

// get 结算明细 - 列表
export async function fetchGetSupplierSettlementList(params) {
  return request('/admin/accountManagement/listUserAccount', {
    params,
  });
}

// get 结算明细 - 详情
export async function fetchGetSupplierSettlementDetail(params) {
  return request('/admin/accountManagement/listUserAccount', {
    params,
  });
}

// post 结算明细 - 新增
export function fetchSupplierSettlementAdd(data) {
  return request('/admin/redEnvelopes/setLuckyRedEnvelopeAuthority', {
    method: 'POST',
    data,
  });
}

// post 结算明细 - 修改
export function fetchSupplierSettlementEdit(data) {
  return request('/admin/redEnvelopes/setLuckyRedEnvelopeAuthority', {
    method: 'POST',
    data,
  });
}
