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

// get 补贴管理 - 任务列表 -  补贴详情列表
export function fetchListSubsidyDetailAll(params) {
  return request('/admin/subsidyManagement/listSubsidyDetailAll', {
    params,
  });
}

// post 补贴管理 - 营销卡豆充值 -  新增
export function fetchSubsidyTaskAdd(data) {
  return request('/admin/subsidyManagement/platformDirectCharge', {
    method: 'POST',
    data,
  });
}

// post 补贴管理 - 平台直充 -  新增
export function fetchSubsidyDirectAdd(data) {
  return request('/admin/subsidyManagement/addDirectCharge', {
    method: 'POST',
    data,
  });
}

// post 补贴管理 - 卡豆回收
export function fetchSubsidyRecycleBean(data) {
  return request('/admin/subsidyManagement/recycleBean', {
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

// get 补贴管理 - 使用规则 - 列表
export function fetchSubsidyActionList(params) {
  return request('/admin/systemConfig/listConfigBehavior', {
    params,
  });
}

// post 补贴管理 - 使用规则 - 新增编辑
export function fetchSubsidyActionAdd(data) {
  return request('/admin/systemConfig/saveConfigBehavior', {
    method: 'POST',
    data,
  });
}

// post 补贴管理 - 使用规则 - 删除
export function fetchSubsidyActionDel(data) {
  return request('/admin/systemConfig/deleteConfigBehavior', {
    method: 'POST',
    data,
  });
}

// post 补贴管理 - 使用规则 - 批量修改
export function fetchActionBatchEdit(data) {
  return request('/admin/systemConfig/batchUpdateConfigBehavior', {
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

// get 提现明细 - 哒人列表
export function fetchWithdrawExpertList(params) {
  return request('/admin/userBeanWithdrawal/listUserBeanWithdrawalManagement', {
    params,
  });
}

// get 提现明细 - 哒人合计
export function fetchWithdrawExpertTotal(params) {
  return request('/admin/userBeanWithdrawal/listUserBeanWithdrawalManagementTotal', {
    params,
  });
}

// post 提现明细 - 哒人设置备注
export function fetchWithdrawExpertSetRemark(data) {
  return request('/admin/userBeanWithdrawal/userBeanWithdrawalRemark', {
    method: 'POST',
    data,
  });
}

// 提现明细 end

// 平台收益

// get 平台收益 - 列表 总收益卡豆
export function fetchPlatformInconme(params) {
  return request('/admin/platform/platformRevenue', {
    params,
  });
}

// get 平台收益 - 详情
export function fetchPlatformInconmeDetail(params) {
  return request('/admin/platform/getPlatformRevenueOrderDetail', {
    params,
  });
}

// 平台收益 end
