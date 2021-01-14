import request from '@/utils/request';

// 提现明细

// get 提现明细 - 列表
export function fetchWithdrawList(params) {
  return request('/admin/merchantBeanManagement/listMerchantBeanWithdrawalManagement', {
    params,
  });
}

// get 提现明细 - 合计
export function fetchWithdrawTotal(params) {
  return request('/admin/merchantBeanManagement/listMerchantBeanWithdrawalManagementTotal', {
    params,
  });
}

// get 提现明细 - 导出excel
export function fetchWithdrawExportExcel(params) {
  return request('/admin/merchantBeanManagement/listMerchantBeanWithdrawalManagementImport', {
    params,
  });
}

// post 提现明细 - 设置备注
export function fetchWithdrawSetRemark(data) {
  return request('/admin/merchantBeanManagement/merchantBeanWithdrawalRemark', {
    method: 'POST',
    data,
  });
}

// 提现明细 end
