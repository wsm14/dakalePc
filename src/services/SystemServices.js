import request from '@/utils/request';

// get 全部的订单查询
export function fetchOrderDetail(params) {
  return request('/admin/accountManagement/getRelatedOrderDetail', {
    params,
  });
}

// get 菜单设置 - 菜单 - 获取菜单
export function fetchMenuList(params) {
  return request('/admin/auth/listAllAccess', {
    params,
  });
}

// get 菜单设置 - 菜单 - 获取菜单信息
export function fetchGetMenuDetail(params) {
  return request('/admin/auth/getAccessById', {
    params,
  });
}

// post 菜单设置 - 菜单 - 新增 修改
export function fetchMenuSet(data) {
  return request('/admin/auth/saveAuthAccess', {
    method: 'POST',
    data,
  });
}

// get 帐号设置 - 帐号 - 获取管理员列表
export function fetchSysAccountList(params) {
  return request('/admin/auth/listAdmin', {
    params,
  });
}

// get 帐号设置 - 帐号 - 角色权限列
export function fetchAccountRoleTree(params) {
  return request('/admin/auth/listAllInUseRole', {
    params,
  });
}

// get 帐号设置 - 帐号 - id获取管理员角色权限列
export function fetchGetAccountRole(params) {
  return request('/admin/auth/listAuthAdminRoleByAdminId', {
    params,
  });
}

// get 帐号设置 - 帐号 - 获取管理员账户信息
export function fetchGetAccountInfo(params) {
  return request('/admin/auth/getAdminInfo', {
    params,
  });
}

// post 帐号设置 - 帐号 - 新增修改管理员帐号
export function fetchAccountEdit(data) {
  return request('/admin/auth/saveAuthAdmin', {
    method: 'POST',
    data,
  });
}

// post 帐号设置 - 帐号 - 保存管理员角色信息
export function fetchAccountRoleEdit(data) {
  return request('/admin/auth/insertAdminRoleBatch', {
    method: 'POST',
    data,
  });
}

// get 帐号设置 - 角色 - 获取角色列表
export function fetchRoleList(params) {
  return request('/admin/auth/listRole', {
    params,
  });
}

// get 帐号设置 - 角色 - 获取角色信息
export function fetchGetRoleInfo(params) {
  return request('/admin/auth/getRoleInfo', {
    params,
  });
}

// get 帐号设置 - 角色 - 获取角色权限树
export function fetchGetRoleTree(params) {
  return request('/admin/auth/getAccessTree', {
    params,
  });
}

// post 帐号设置 - 角色 - 新增修改角色信息
export function fetchRoleEdit(data) {
  return request('/admin/auth/saveAuthRole', {
    method: 'POST',
    data,
  });
}

// post 帐号设置 - 角色 - 角色拥有页面设置
export function fetchRoleMenuSet(data) {
  return request('/admin/auth/insertRoleAccessBatch', {
    method: 'POST',
    data,
  });
}

// get App设置 - 图片列表
export function fetchBannerList(params) {
  return request('/admin/systemConfig/listBannerMarketPlatform', {
    params,
  });
}

// post App设置 - 图片下架/图片删除 修改
export function fetchBannerStatusDel(data) {
  return request('/admin/systemConfig/updateBannerMarketPlatform', {
    method: 'POST',
    data,
  });
}

// post App设置 - 图片新增
export function fetchBannerSet(data) {
  return request('/admin/systemConfig/saveBannerMarketPlatform', {
    method: 'POST',
    data,
  });
}

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

// get 打卡设置 - 打卡列表
export function fetchCheckInList(params) {
  return request('/admin/healthLife/listUserHealthLife', {
    params,
  });
}

// get 打卡设置 - 图片文案列表
export function fetchCheckInImgTextList(params) {
  return request('/admin/healthLife/listUserHealthListWords', {
    params,
  });
}

// post 打卡设置 - 打卡列表编辑
export function fetchCheckInEdit(data) {
  return request('/admin/healthLife/updateUserHealthLifeStyleMarkTime', {
    method: 'POST',
    data,
  });
}

// post 打卡设置 - 图片 文案编辑
export function fetchCheckInTextImgEdit(data) {
  return request('/admin/healthLife/updateUserHealthLifeStyleContent', {
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
  return request('/admin/systemIndustry/upsertConfigMerchantSettle', {
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
