import request from '@/utils/request';

// get 问题反馈 - 列表
export async function fetchFeedBackList(params) {
  return request('/admin/marketCustomer/listUserFeedbackMarketPlatform', {
    params,
  });
}

// post 问题反馈 - 确认反馈
export function fetchFeedBackPush(data) {
  return request('/admin/marketCustomer/replayUserFeedback', {
    method: 'POST',
    data,
  });
}

// get 视屏列表 - 列表
export function fetchMerVideoList(params) {
  return request('/admin/marketingManagement/listMerchantMoment', {
    params,
  });
}

// post 视屏列表 - 删除
export function fetchMerVideoDel(data) {
  return request('/admin/marketingManagement/closeUserMoment', {
    method: 'POST',
    data,
  });
}

// get 新闻动态 - 列表
export async function fetchNewsList(params) {
  return request('/admin/news/listNews', {
    params,
  });
}

// post 视屏列表 - 新增
export function fetchNewsEdit(data) {
  return request('/admin/news/saveNews', {
    method: 'POST',
    data,
  });
}

// post 视屏列表 - 下架
export function fetchNewsStatus(data) {
  return request('/admin/news/updateNews', {
    method: 'POST',
    data,
  });
}

// get 限制业务员 - 列表
export async function fetchLimitPopList(params) {
  return request('/admin/recommendReward/listRecommendReward', {
    params,
  });
}

// post 限制业务员 - 新增人员
export function fetchLimitPopAdd(data) {
  return request('/admin/recommendReward/saveRecommendReward', {
    method: 'POST',
    data,
  });
}