import request from '@/utils/request';

// 菜单设置

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

// 菜单设置 end

// 城市管理

// get 城市管理 - 城市列表
export function fetchCityManageList(params) {
  return request('/admin/locationCityManagement/listLocationCity', {
    params,
  });
}

// post 城市管理 - 新增修改
export function fetchCityManageSet(data) {
  return request('/admin/locationCityManagement/saveOrUpdateLocationCity', {
    method: 'POST',
    data,
  });
}

// post 城市管理 - 状态修改
export function fetchCityManageStatus(data) {
  return request('/admin/locationCityManagement/deleteLocationCity', {
    method: 'POST',
    data,
  });
}

// 城市管理 end

// 哒人配置

// get 哒人配置 - 列表
export function fetchExpertAllocationList(params) {
  return request('/admin/systemConfig/listUserLevel', {
    params,
  });
}

// post 哒人配置 - 新增
export function fetchExpertAllocationSave(data) {
  return request('/admin/systemConfig/saveUserLevel', {
    method: 'POST',
    data,
  });
}

// post 哒人配置 - 修改
export function fetchExpertAllocationEdit(data) {
  return request('/admin/systemConfig/updateUserLevel', {
    method: 'POST',
    data,
  });
}

// 哒人配置 end

// 热门搜索

// get 热门搜索 - 回显
export function fetchSearchGetData(params) {
  return request('/common/category/getHotMerchantCategory', {
    params,
  });
}

// post 热门搜索 - 配置
export function fetchSearchSet(data) {
  return request('/common/category/setHotMerchantCategory', {
    method: 'POST',
    data,
  });
}

// 热门搜索 end

// 逛逛页面配置

// get 风向标配置 - 列表
export function fetchWalkManageVaneList(params) {
  return request('/admin/systemConfig/listConfigWindVane', {
    params,
  });
}

// get 风向标配置 - 详情
export function fetchWalkManageVaneDetail(params) {
  return request('/admin/systemConfig/getConfigWindVaneById', {
    params,
  });
}

// post 风向标配置 - 编辑删除
export function fetchWalkManageVaneEditDel(data) {
  return request('/admin/systemConfig/updateConfigWindVane', {
    method: 'POST',
    data,
  });
}

// post 风向标配置 - 排序
export function fetchWalkManageVaneSort(data) {
  return request('/admin/systemConfig/sortConfigWindVane', {
    method: 'POST',
    data,
  });
}

// post 风向标配置 - 新增
export function fetchWalkManageVaneAdd(data) {
  return request('/admin/systemConfig/saveConfigWindVane', {
    method: 'POST',
    data,
  });
}

// get 导航类目页面配置 - 列表 / 风向标配置 - 获取场景选择
export function fetchWalkManageNavigation() {
  return request('/admin/systemIndustry/listAllCategoryScenes');
}

// post 导航类目页面配置 - 排序
export function fetchWalkManageNavigationSort(data) {
  return request('/admin/systemConfig/configCategoryNavigation', {
    method: 'POST',
    data,
  });
}

// get 特惠商品类目配置 - 列表
export function fetchWalkManageGratiaClass() {
  return request('/common/category/listSpecialGoodsCategory');
}

// post 导航类目页面配置 - 新增
export function fetchWalkManageGratiaClassAdd(data) {
  return request('/common/category/setSpecialGoodsCategory', {
    method: 'POST',
    data,
  });
}

// 逛逛页面配置 end

// 新人下单配置 start

//新人下单配置列表
export function fetchWelfareConfigList(params) {
  return request('/admin/systemConfig/listConfigNewcomerOrders', {
    params,
  });
}

//  新增、修改 新人下单配置
export function fetchWelfareUpdate(data) {
  return request('/admin/systemConfig/saveOrUpdateConfigNewcomerOrders', {
    method: 'POST',
    data,
  });
}

// 删除 新人下单配置
export function fetchWelfareDelete(data) {
  return request('/admin/systemConfig/deleteConfigNewcomerOrders', {
    method: 'POST',
    data,
  });
}

// 新人下单配置 end
