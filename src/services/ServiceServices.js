import request from '@/utils/request';

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

// 消息推送

// 消息推送 - 列表
export function fetchMsgPushList(params) {
  return request('/admin/messagePushManagement/listMessagePush', {
    params,
  });
}

// 消息推送 end
