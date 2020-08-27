import request from '@/utils/request';

// get 帐号设置 - 帐号 -  获取登录账户权限菜单
export function fetchMenuList(params) {
  return request('/merchant/auth/getAccessTree', {
    params,
  });
}

// get 帐号设置 - 角色 - 获取角色列表
export function fetchRoleList(params) {
  return request('/admin/auth/listRole', {
    params,
  });
}

// get 帐号设置 - 帐号 - 获取管理员列表
export function fetchSysAccountList(params) {
  return request('/admin/auth/listAdmin', {
    params,
  });
}

// get 帐号设置 - 角色 - 获取角色信息
export function fetchGetRoleInfo(params) {
  return request('/admin/auth/getRoleInfo', {
    params,
  });
}

// get 帐号设置 - 帐号 - 获取管理员账户信息
export function fetchGetAccountInfo(params) {
  return request('/admin/auth/getAdminInfo', {
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

// post 帐号设置 - 角色 - 删除角色
export function fetchRoleDel(data) {
  return request('/admin/auth/saveAuthRole', {
    method: 'POST',
    data,
  });
}

// post 帐号设置 - 帐号 - 新增修改管理员帐号
export function fetchAccountEdit(data) {
  return request('/admin/auth/saveAuthAdmin', {
    method: 'POST',
    data,
  });
}

// get App设置 - 图片列表
export function fetchBannerList(params) {
  return request('/admin/SystemConfig/listBannerMarketPlatform', {
    params,
  });
}

// get App设置 - 获取图片详情
export function fetchBannerDetail(params) {
  return request('/admin/auth/saveAuthRodle', {
    params,
  });
}

// post App设置 - 图片下架/图片删除
export function fetchBannerStatusDel(data) {
  return request('/admin/SystemConfig/updateBannerMarketPlatform', {
    method: 'POST',
    data,
  });
}

// post App设置 - 图片新增
export function fetchBannerSet(data) {
  return request('/admin/SystemConfig/saveBannerMarketPlatform', {
    method: 'POST',
    data,
  });
}

// get 卡豆分享 - 列表
export function fetchPeasShareList(params) {
  return request('/admin/auth/saveAuthRodle', {
    params,
  });
}

// get 卡豆分享 - 获取修改详情
export function fetchPeasShareDetail(params) {
  return request('/admin/auth/saveAuthRodle', {
    params,
  });
}

// post 卡豆分享 - 新增
export function fetchPeasShareAdd(data) {
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}

// post 卡豆分享 - 修改
export function fetchPeasShareEdit(data) {
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}

// post 卡豆分享 - 删除
export function fetchPeasShareDel(data) {
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}

// get 打卡设置 - 打卡列表
export function fetchCheckInList(params) {
  return request('/admin/systemConfig/listMarkConfig', {
    params,
  });
}

// get 打卡设置 - 图片文案列表
export function fetchCheckInImgTextList(params) {
  return request('/admin/systemConfig/listConfigMarkContent', {
    params,
  });
}

// post 打卡设置 - 打卡列表编辑
export function fetchCheckInEdit(data) {
  return request('/admin/systemConfig/updateMarkConfig', {
    method: 'POST',
    data,
  });
}

// post 打卡设置 - 文案编辑
export function fetchCheckInTextEdit(data) {
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}

// post 打卡设置 - 图片编辑
export function fetchCheckInImgEdit(data) {
  return request('/admin/auth/saveAfuthRole', {
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

// get 行业设置 - 类目详情
export function fetchTradeDetail(params) {
  return request('/admin/auth/saveAfuthRole', {
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
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}

// post 行业设置 - 修改类目
export function fetchTradeEdit(data) {
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}

// post 行业设置 - 删除类目
export function fetchTradeDel(data) {
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}
