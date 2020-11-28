import request from '@/utils/request';

// get 全部的订单查询
export function fetchOrderDetail(params) {
  return request('/admin/accountManagement/getRelatedOrderDetail', {
    params,
  });
}

// get 菜单设置 - 菜单 - 获取菜单
export function fetchMenuList(params) {
  return request('/admin/access/listAllAccess', {
    params,
  });
}

// get 菜单设置 - 菜单 - 获取菜单信息
export function fetchGetMenuDetail(params) {
  return request('/admin/access/getAccessById', {
    params,
  });
}

// post 菜单设置 - 菜单 - 新增 修改
export function fetchMenuSet(data) {
  return request('/admin/access/saveAuthAccess', {
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

// post 打卡设置 - 图片 文案新增
export function fetchCheckInTextImgAdd(data) {
  return request('/admin/healthLife/saveUserHealthLifeStyleContent', {
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

// post 帐号设置 - 修改密码
export function fetchPassWordEdit(data) {
  return request('/admin/admin/account/updatePassword', {
    method: 'POST',
    data,
  });
}
