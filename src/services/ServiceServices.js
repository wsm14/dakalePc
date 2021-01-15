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

// get 消息推送 - 列表
export function fetchMsgPushList(params) {
  return request('/admin/messagePushManagement/listMessagePush', {
    params,
  });
}

// get 消息推送 - 详情
export function fetchMsgPushDetail(params) {
  return request('/admin/messagePushManagement/getMessagePushById', {
    params,
  });
}

// post 消息推送 - 新增
export function fetchMsgPushAdd(data) {
  return request('/admin/messagePushManagement/createUserMessagePush', {
    method: 'POST',
    data,
  });
}

// post 消息推送 - 编辑
export function fetchMsgPushEdit(data) {
  return request('/admin/messagePushManagement/updateUserMessagePush', {
    method: 'POST',
    data,
  });
}

// post 消息推送 - 复制
export function fetchMsgPushCopy(data) {
  return request('/admin/messagePushManagement/copyUserMessagePush', {
    method: 'POST',
    data,
  });
}

// post 消息推送 - 推送
export function fetchMsgPush(data) {
  return request('/admin/messagePushManagement/pushMessage', {
    method: 'POST',
    data,
  });
}

// post 消息推送 - 删除消息
export function fetchMsgPushDel(data) {
  return request('/admin/messagePushManagement/cancelMessagePush', {
    method: 'POST',
    data,
  });
}

// post 消息推送 - 撤回推送
export function fetchMsgPushRevoke(data) {
  return request('/admin/messagePushManagement/batchDeleteMessagePush', {
    method: 'POST',
    data,
  });
}

// 消息推送 end
