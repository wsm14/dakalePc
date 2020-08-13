import request from '@/utils/request';

// get 挑战赛列表
export async function fetchMarketMatch(params) {
  return request('/admin/marketingManagement/pageUserMatchByDateAndType', {
    params,
  });
}

// get 营销活动列表
export async function fetchMarketActivity(params) {
  return request('/admin/marketingActivity/listActivity', {
    params,
  });
}

// get 活动商家列表
export async function fetchMarketActivityStore(params) {
  return request('/admin/marketCoupon/listMarketCoupon', {
    params,
  });
}

// get 输入商家名称查找商家
export async function fetchMarketActivityStoreName(params) {
  return request('/admin/marketCoupon/listMerchantName', {
    params,
  });
}

// get 选择商家 获取标签
export async function fetchStoreGoodsType(params) {
  return request('/admin/marketingActivity/listCategoryByMerchantId', {
    params,
  });
}

// get 获取优惠券详情
export async function fetchStoreGoodsCouponInfo(params) {
  return request('/admin/marketCoupon/getMarketCouponDeduct', {
    params,
  });
}

// post 营销活动下架
export function fetchMarketActivityCancel(data) {
  return request('/admin/marketingActivity/updateActivity', {
    method: 'POST',
    data,
  });
}

// post 营销活动新增
export function fetchMarketActivityAdd(data) {
  return request('/admin/marketingActivity/addActivity', {
    method: 'POST',
    data,
  });
}

// post 商家新增
export function fetchMarketActivityStoreSet(data) {
  return request('/admin/marketCoupon/addUserMarketCoupon', {
    method: 'POST',
    data,
  });
}

// post 优惠券新增
export function fetchMarketActivityCouponSet(data) {
  return request('/admin/marketCoupon/addMarketCouponDeduct', {
    method: 'POST',
    data,
  });
}

// post 早起挑战赛设置
export function fetchMarketMatchMorningSet(data) {
  return request('/admin/marketingManagement/updateMatchWakeUp', {
    method: 'POST',
    data,
  });
}

// post 步数挑战赛设置
export function fetchMarketMatchRuningSet(data) {
  return request('/admin/marketingManagement/updateMatchWalk', {
    method: 'POST',
    data,
  });
}
