import request from '@/utils/request';

// get 卡豆分享 - 列表
export function fetchPeasShareList(params) {
  return request('/admin/systemConfig/listConfigMoment', {
    params,
  });
}

// post 卡豆分享 - 新增
export function fetchPeasShareAdd(data) {
  return request('/admin/systemConfig/saveConfigMoment', {
    method: 'POST',
    data,
  });
}

// post 卡豆分享 - 修改 删除
export function fetchPeasShareEdit(data) {
  return request('/admin/systemConfig/updateConfigMoment', {
    method: 'POST',
    data,
  });
}

// get 行业设置 - 列表
export function fetchTradeList(params) {
  return request('/admin/systemIndustry/listCategory', {
    params,
  });
}

// get 行业设置 - 基础设施列表
export function fetchTradeBaseList(params) {
  return request('/admin/systemIndustry/getInfrastructure', {
    params,
  });
}

// get 行业设置 - 平台服务费列表
export function fetchTradePlatformList(params) {
  return request('/admin/systemIndustry/listConfigMerchantSettle', {
    params,
  });
}

// get 行业设置 - 特色服务列表
export function fetchTradeSpecialList(params) {
  return request('/admin/systemIndustry/getCategorySpecialService', {
    params,
  });
}

// get 行业设置 - 推广费 - 获取显示
export function fetchPromotionMoneyGet(params) {
  return request('/admin/systemIndustry/getIndustryPromotionFee', {
    params,
  });
}

// post 行业设置 - 推广费 - 设置
export function fetchPromotionMoneySet(data) {
  return request('/admin/systemIndustry/setIndustryPromotionFee', {
    method: 'POST',
    data,
  });
}

// post 行业设置 - 基础设施 - 新增修改删除
export function fetchTradeBaseSet(data) {
  return request('/admin/systemIndustry/updateInfrastructure', {
    method: 'POST',
    data,
  });
}

// post 行业设置 - 特色服务 - 新增修改删除
export function fetchTradeSpecialSet(data) {
  return request('/admin/systemIndustry/updateCategorySpecialService', {
    method: 'POST',
    data,
  });
}

// post 行业设置 - 平台服务费 - 新增修改删除
export function fetchTradePlatformSet(data) {
  return request('/admin/systemIndustry/updateConfigMerchantSettle', {
    method: 'POST',
    data,
  });
}

// post 行业设置 - 新增类目
export function fetchTradeAdd(data) {
  return request('/admin/systemIndustry/saveCategory', {
    method: 'POST',
    data,
  });
}

// post 行业设置 - 删除 修改类目
export function fetchTradeSet(data) {
  return request('/admin/systemIndustry/updateCategory', {
    method: 'POST',
    data,
  });
}

// post 行业设置 - 小程序是否可见
export function fetchTradeWeChat(data) {
  return request('/admin/systemIndustry/setCategoryIsWeChat', {
    method: 'POST',
    data,
  });
}
// 行业设置-扫码付服务费比例
export function fetchTradeScanCommissionSet(data) {
  return request('/admin/categoryScanCommission/setCategoryScanCommission', {
    method: 'POST',
    data,
  });
}

// 获取行业-扫码付服务费比例

export function fetchTradeScanCommission(params) {
  return request('/admin/categoryScanCommission/getCategoryScanCommission', {
    params,
  });
}

// post 帐号设置 - 修改密码
export function fetchPassWordEdit(data) {
  return request('/admin/admin/account/updatePassword', {
    method: 'POST',
    data,
  });
}

// 权限设置

// get 任何系统 - 部门列表
export function fetchAllSectionList(params) {
  return request('/admin/department/listDepartment', {
    params,
  });
}

// post 任何系统 - 部门新增
export function fetchAllSectionAdd(data) {
  return request('/admin/department/saveDepartment', {
    method: 'POST',
    data,
  });
}

// post 任何系统 - 部门修改
export function fetchAllSectionEdit(data) {
  return request('/admin/department/updateDepartment', {
    method: 'POST',
    data,
  });
}

// get 任何系统 - 角色列表 分页
export function fetchAllRoleList(params) {
  return request('/admin/role/listAuthRole', {
    params,
  });
}

// get 任何系统 - 角色列表选择项
export function fetchAllRoleSelect(params) {
  return request('/admin/role/listAuthRoleAll', {
    params,
  });
}

// get 任何系统 - 获取用户可配置角色详情
export function fetchAllUserRoleDetail(params) {
  return request('/admin/role/currentRoleDetail', {
    params,
  });
}

// get 任何系统 - 获取角色详情
export function fetchAllGetRoleDetail(params) {
  return request('/admin/role/roleDetail', {
    params,
  });
}

// get 任何系统 - 用户权级等级
export function fetchAllGetRoleFlag(params) {
  return request('/admin/role/roleFlag', {
    params,
  });
}

// post 任何系统 - 角色列表新增
export function fetchAllRoleAdd(data) {
  return request('/admin/role/saveAuthRole', {
    method: 'POST',
    data,
  });
}

// post 任何系统 - 角色列表修改
export function fetchAllRoleEdit(data) {
  return request('/admin/role/updateAuthRole', {
    method: 'POST',
    data,
  });
}

// get 任何系统 - 菜单 - 获取所有菜单
export function fetchAllGetMenu(params) {
  return request('/admin/access/listAllAccess', {
    params,
  });
}

// 权限设置 end

// 运营后台账号

// get 运营后台账号 - 用户列表
export function fetchOwnAccountList(params) {
  return request('/admin/admin/account/listAdminAccount', {
    params,
  });
}

// get 运营后台账号 - 用户详情
export function fetchOwnAccountDetail(params) {
  return request('/admin/admin/account/getAdminAccountDetail', {
    params,
  });
}

// post 运营后台账号 - 用户新增
export function fetchOwnAccountAdd(data) {
  return request('/admin/admin/account/saveAdminAccount', {
    method: 'POST',
    data,
  });
}

// post 运营后台账号 - 用户修改
export function fetchOwnAccountEdit(data) {
  return request('/admin/admin/account/updateAdminAccount', {
    method: 'POST',
    data,
  });
}

// 运营后台账号 end

// 商圈

// get 商圈管理 - 列表
export function fetchTradeAreaList(params) {
  return request('/admin/businessHub/listBusinessHubAdmin', {
    params,
  });
}

// post 商圈管理 - 新增
export function fetchTradeAreaAdd(data) {
  return request('/admin/businessHub/saveBusinessHub', {
    method: 'POST',
    data,
  });
}

// post 商圈管理 - 修改
export function fetchTradeAreaEdit(data) {
  return request('/admin/businessHub/updateBusinessHub', {
    method: 'POST',
    data,
  });
}

// end

// 品牌管理

// get 品牌 - 品牌列表
export function fetchMerBrandList(params) {
  return request('/admin/systemConfig/listConfigBrand', {
    params,
  });
}

// post 品牌 - 品牌新增
export function fetchMerBrandAdd(data) {
  return request('/admin/systemConfig/saveConfigBrand', {
    method: 'POST',
    data,
  });
}

// post 品牌 - 品牌修改
export function fetchMerBrandEdit(data) {
  return request('/admin/systemConfig/updateConfigBrand', {
    method: 'POST',
    data,
  });
}

// 品牌管理 end

// 支行管理

// get 支行设置 - 列表
export function fetchMerBankSetList(params) {
  return request('/admin/bankBranch/pageBankBranch', {
    params,
  });
}

// get 支行设置 - 总行列表
export function fetchMerBankAll(params) {
  return request('/admin/bankBranch/listBankName', {
    params,
  });
}

// post 支行设置 - 新增
export function fetchMerBankAdd(data) {
  return request('/admin/bankBranch/saveBankBranch', {
    method: 'POST',
    data,
  });
}

// post 支行设置 - 修改
export function fetchMerBankEdit(data) {
  return request('/admin/bankBranch/updateBankBranch', {
    method: 'POST',
    data,
  });
}

// 支行管理 end

// 行业设置 通过行业id获取行业场景列表
export function fetchSceneListById(params) {
  return request('/admin/systemIndustry/listCategoryScenesByCategoryId', {
    params,
  });
}

// 新增行业场景
export function fetchSceneAdd(data) {
  return request('/admin/systemIndustry/saveCategoryScenes', {
    method: 'POST',
    data,
  });
}

// 编辑删除行业场景
export function fetchSceneUpdate(data) {
  return request('/admin/systemIndustry/updateCategoryScenes', {
    method: 'POST',
    data,
  });
}
