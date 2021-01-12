import request from '@/utils/request';

// 问题反馈

// get 问题反馈 - 列表
export async function fetchFeedBackList(params) {
  return request('/admin/marketCustomer/listUserFeedbackMarketPlatform', {
    params,
  });
}

// post 问题反馈 - 问题反馈详情
export function fetchFeedBackDetail(params) {
  return request('/admin/marketCustomer/getUserFeedbackDetail', {
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

// 问题反馈 end

// 新闻动态

// get 新闻动态 - 列表
export async function fetchNewsList(params) {
  return request('/admin/news/listNews', {
    params,
  });
}

// post 新闻动态 - 新增
export function fetchNewsEdit(data) {
  return request('/admin/news/saveNews', {
    method: 'POST',
    data,
  });
}

// post 新闻动态 - 下架
export function fetchNewsStatus(data) {
  return request('/admin/news/updateNews', {
    method: 'POST',
    data,
  });
}

// 新闻动态 end

// FAQ

// get FAQ - 列表
export async function fetchFAQList(params) {
  return request('/admin/questionManagement/listCommonQuestionManagement', {
    params,
  });
}

// get FAQ - 分类列表
export async function fetchFAQSortList(params) {
  return request('/admin/questionManagement/listCommonQuestionCategoryManagement', {
    params,
  });
}

// post FAQ - 删除问题
export function fetchFAQDel(data) {
  return request('/admin/questionManagement/batchDeleteCommonQuestion', {
    method: 'POST',
    data,
  });
}

// post FAQ - 新增
export function fetchFAQEdit(data) {
  return request('/admin/news/saveNews', {
    method: 'POST',
    data,
  });
}

// post FAQ - 下架
export function fetchFAQStatus(data) {
  return request('/admin/news/updateNews', {
    method: 'POST',
    data,
  });
}

// FAQ end
