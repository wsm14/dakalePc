import request from '@/utils/request';

// get 版本列表 - 列表
export async function fetchAllocationList(params) {
  return request('/common/promotion/osVersion', {
    params,
  });
}

// get 活动配置 - 广告位列表
export function fetchAllocationPlaceList(params) {
  return request('/common/promotion/getPromotionByVersionAndOsType', {
    params,
  });
}

// get 活动配置 - 原生页面列表
export function fetchAllocationNative(params) {
  return request('/admin/promotionNative/listNative', {
    params,
  });
}
// post 活动配置 - 修改
export function fetchAllocationSetEdit(data) {
  return request('/common/promotion/updatePromotion', {
    method: 'POST',
    data,
  });
}
// post 活动配置 - 活动新增配置
export function fetchAllocationDetailAdd(data) {
  return request('/common/promotion/savePromotion', {
    method: 'POST',
    data,
  });
}

// get 活动列表 - 列表
export async function fetchActiveList(params) {
  return request('/admin/promotionActivity/pagePromotionActivity', {
    params,
  });
}

// post 活动列表 - 新增修改
export function fetchActiveEdit(data) {
  return request('/admin/promotionActivity/savePromotionActivity', {
    method: 'POST',
    data,
  });
}

// get 数据源 - 商家
export async function fetchSourceMerchant(params) {
  return request('/admin/promotionData/pageUserMerchantInfo', {
    params,
  });
}

// get 数据源 - 商品
export async function fetchSourceGoods(params) {
  return request('/admin/promotionData/pageMerchantGoodsInfo', {
    params,
  });
}
