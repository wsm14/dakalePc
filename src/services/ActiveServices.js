import request from '@/utils/request';

// get 获取oss凭证 - 上传网页
export async function fetchGetOss(params) {
  return request('/common/oss/getOssPolicy', {
    params,
  });
}

// get 获取特惠商品选择列表
export async function fetchSpecialGoodsSelect(params) {
  return request('/admin/specialGoodsManagement/listSpecialGoodsForActivityTemp', {
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

// --------------------------------------------------

// get 版本列表 - 列表
export async function fetchActiveList(params) {
  return request('/common/promotion/osVersion', {
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
