import request from '@/utils/request';

// 店铺数据

// get 店铺数据 - 店铺列表
export function fetchMerchantList(params) {
  return request('/admin/merchantManagement/listMerchant', {
    params,
  });
}

// get 店铺数据 - 店铺列表 - 导出excel
export function fetchMerchantExportExcel(params) {
  return request('/admin/merchantManagement/listMerchantImport', {
    params,
  });
}

// get 店铺数据 - 统计数据 总商家/流失/活跃
export function fetchMerchantTotal() {
  return request('/admin/areaStatistic/getMerchantStatistic');
}

// get 店铺数据 - 统计数据 新入驻/家主/家店/行业
export function fetchMerchantTotalCategory(params) {
  return request('/admin/areaStatistic/getMerchantStatisticByDate', {
    params,
  });
}

// get 店铺数据 - 店铺详情
export function fetchMerchantDetail(params) {
  return request('/admin/merchantManagement/merchantCredentialsInfo', {
    params,
  });
}

// post 店铺数据 - 商家 设置开户行号
export function fetchMerSetBandCode(data) {
  return request('/admin/merchantManagement/updateMerchantBankSwiftCode', {
    method: 'POST',
    data,
  });
}

// post 店铺数据 - 商家新增
export function fetchMerchantAdd(data) {
  return request('/admin/userMerchantVerify/saveUserMerchantVerify', {
    method: 'POST',
    data,
  });
}

// post 店铺数据 - 商家 修改
export function fetchMerchantEdit(data) {
  return request('/admin/merchantManagement/editMerchant', {
    method: 'POST',
    data,
  });
}

// post 店铺数据 - 商家 设置
export function fetchMerchantSet(data) {
  return request('/admin/merchantManagement/updateMerchantBeanSet', {
    method: 'POST',
    data,
  });
}

// post 店铺数据 - 商家 店铺状态 经营状态 修改
export function fetchMerchantStatus(data) {
  return request('/admin/merchantManagement/updateUserMerchant', {
    method: 'POST',
    data,
  });
}

// post 店铺数据 - 设置商家端验证码
export function fetchMerVerificationCodeSet(data) {
  return request('/admin/merchantManagement/setMerchantLogonCode', {
    method: 'POST',
    data,
  });
}

// 店铺数据 end

// 新店审核

// get 店铺审核 - 店铺新店审核
export function fetchMerchantAuditList(params) {
  return request('/admin/merchantManagement/listMerchantVerify', {
    params,
  });
}

// get 店铺审核 - 店铺审核详情列表
export function fetchMerchantAuditDetailList(params) {
  return request('/admin/userMerchantVerifyRecord/listUserMerchantVerifyRecord', {
    params,
  });
}

// get 店铺审核 - 店铺审核详情
export function fetchMerchantAuditDetail(params) {
  return request('/admin/merchantManagement/getMerchantVerifyDetail', {
    params,
  });
}

// post 店铺审核 - 商家 审核
export function fetchMerSaleAudit(data) {
  return request('/admin/userMerchantVerify/updateUserMerchantVerifyStatusInfo', {
    method: 'POST',
    data,
  });
}

// 新店审核 end

// get 注册列表 - 列表
export function fetchMerRegisterList(params) {
  return request('/admin/merchantManagement/listMerchantUnVerified', {
    params,
  });
}

// 入驻查询

// get 入驻查询 - 列表
export function fetchMerSettledList(params) {
  return request('/admin/merchantManagement/listMerchantSettleIn', {
    params,
  });
}

// get 入驻查询 - 获取excel数据
export function fetchGetMerSettledExcel(params) {
  return request('/admin/merchantManagement/importListMerchantSettleIn', {
    params,
  });
}

// 入驻查询 end

// 集团管理

// get 集团列表 - 列表
export function fetchMerchantGroup(params) {
  return request('/admin/merchantGroup/listMerchantGroup', {
    params,
  });
}

// post 新增集团
export function fetchAddMerchantGroup(data) {
  return request('/admin/merchantGroup/saveMerchantGroup', {
    method: 'POST',
    data,
  });
}

// post 绑定银行卡
export function fetchMerchantBank(data) {
  return request('/admin/merchantGroup/bindingBankInfo', {
    method: 'POST',
    data,
  });
}

// get 获取角色列表
export function fetchWMSUserRoles(params) {
  return request('/admin/role/listAuthRoleAll', {
    params,
  });
}

// get 获取集团详情
export function fetchGrounpDetails(params) {
  return request('/admin/merchantGroup/merchantGroupDetail', {
    params,
  });
}

// post 修改集團
export function fetchUpdateGroup(data) {
  return request('/admin/merchantGroup/updateMerchantGroup', {
    method: 'POST',
    data,
  });
}

// get 获取crm集团门店列表
export function fetchCrmGrounpList(params) {
  return request('/admin/merchantGroup/listSellMerchantGroup', {
    params,
  });
}

// post 获取子门店列表
export function fetchGroupStoreList(data) {
  return request('/admin/merchantGroup/listMySubMerchantData', {
    method: 'POST',
    data,
  });
}

// 集团管理 end
