import request from '@/utils/request';

// get 获取oss凭证 - 上传网页
export async function fetchGetOss(params) {
  return request('/common/oss/getOssPolicy', {
    params,
  });
}

// get 获取电商商品选择列表
export function fetchCommerceGoodsSelect(params) {
  return request('/admin/specialGoodsManagement/listSpecialGoodsManagement', {
    params,
  });
}

// get 获取优惠券选择列表
export async function fetchCouponSelect(params) {
  return request('/admin/coupon/listCouponForActivityTemp', {
    params,
  });
}

// get 获取商家详细数量 - 券/打卡豆数/券数量
export async function fetchGetMreConfigInfo(params) {
  return request('/admin/merchantManagement/getSomeInfoByOwnerId', {
    params,
  });
}

// post 活动列表 - 新增
export function fetchActiveAdd(data) {
  return request('/admin/activityTemplate/saveActivityTemplate', {
    method: 'POST',
    data,
  });
}

// post 活动配置 - 修改
export function fetchActiveEdit(data) {
  return request('/admin/activityTemplate/updateActivityTemplate', {
    method: 'POST',
    data,
  });
}

// get 活动列表 - 列表
export async function fetchActiveList(params) {
  return request('/admin/activityTemplate/listActivityTemplate', {
    params,
  });
}

// get 活动列表 - 详情
export async function fetchActiveDetail(params) {
  return request('/admin/activityTemplate/getActivityTemplateById', {
    params,
  });
}

// 营销物料配置

// get 营销物料配置 - 列表
export async function fetchMaterialConfigList(params) {
  return request('/admin/matterConfig/listMatterConfig', {
    params,
  });
}

// post 营销物料配置 - 获取用户二维码
export function fetchMaterialConfigUserCode(data) {
  return request('/admin/matterConfig/getUserMiniProgramQCode', {
    method: 'POST',
    data,
  });
}

// post 营销物料配置 - 保存
export function fetchMaterialConfigSave(data) {
  return request('/admin/matterConfig/saveMatterConfig', {
    method: 'POST',
    data,
  });
}

// 营销物料配置 end

// 盲盒抽奖配置

// get 盲盒奖池列表 - 列表
export async function fetchBlindBoxList(params) {
  return request('/admin/luckDraw/getPrizePoolList', {
    params,
  });
}

// post 盲盒奖池 - 添加
export function fetchAddPrizePool(data) {
  return request('/admin/luckDraw/addPrizePool', {
    method: 'POST',
    data,
  });
}

// post 盲盒奖池 - 修改
export function fetchUpdatePrizePool(data) {
  return request('/admin/luckDraw/updatePrizePool', {
    method: 'POST',
    data,
  });
}

// post 盲盒奖池 - 删除
export function fetchDeletePrizePool(data) {
  return request('/admin/luckDraw/deletePrizePool', {
    method: 'POST',
    data,
  });
}

// get 盲盒抽奖配置 - 列表
export async function fetchGetLuckDrawPool(params) {
  return request('/admin/luckDraw/getLuckDrawPool', {
    params,
  });
}

// post 盲盒抽奖配置 - 设置
export function fetchSetLuckDrawConfig(data) {
  // /admin/luckDraw/setLuckDrawConfig
  return request('/admin/luckDraw/setLuckDrawConfig', {
    method: 'POST',
    data,
  });
}

// 盲盒抽奖配置 end
