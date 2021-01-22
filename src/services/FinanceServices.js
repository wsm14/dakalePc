import request from '@/utils/request';

// 补贴管理

// get 补贴管理 - 任务列表 - 列表
export function fetchSubsidyTaskList(params) {
  return request('/admin/subsidyManagement/listSubsidy', {
    params,
  });
}

// get 补贴管理 - 任务列表 -  导出
export function fetchSubsidyTaskGetExcel(params) {
  return request('/admin/subsidyManagement/listSubsidyImport', {
    params,
  });
}

// get 补贴管理 - 任务列表 -  详情
export function fetchSubsidyTaskDetail(params) {
  return request('/admin/subsidyManagement/getSubsidyById', {
    params,
  });
}

// post 补贴管理 - 任务列表 -  新增
export function fetchSubsidyTaskAdd(data) {
  return request('/admin/subsidyManagement/platformDirectCharge', {
    method: 'POST',
    data,
  });
}

// post 补贴管理 - 任务列表 -  删除 结束
export function fetchSubsidyTaskEndDel(data) {
  return request('/admin/subsidyManagement/updateSubsidy', {
    method: 'POST',
    data,
  });
}

// 补贴管理 end

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
