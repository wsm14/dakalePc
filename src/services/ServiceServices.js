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

// post FAQ - 新增问题
export function fetchFAQAdd(data) {
  return request('/admin/questionManagement/saveCommonQuestion', {
    method: 'POST',
    data,
  });
}

// post FAQ - 删除问题
export function fetchFAQDel(data) {
  return request('/admin/questionManagement/batchDeleteCommonQuestion', {
    method: 'POST',
    data,
  });
}

// post FAQ - 编辑问题
export function fetchFAQEdit(data) {
  return request('/admin/questionManagement/updateCommonQuestion', {
    method: 'POST',
    data,
  });
}

// post FAQ - 问题排序
export function fetchFAQSort(data) {
  return request('/admin/questionManagement/sortCommonQuestion', {
    method: 'POST',
    data,
  });
}

// get FAQ - 分类列表
export async function fetchFAQSortList(params) {
  return request('/admin/questionManagement/listCommonQuestionCategoryManagement', {
    params,
  });
}

// post FAQ - 问题分类 - 新增
export function fetchFAQSortAdd(data) {
  return request('/admin/questionManagement/saveCommonQuestionCategory', {
    method: 'POST',
    data,
  });
}

// post FAQ - 问题分类 - 修改
export function fetchFAQSortEdit(data) {
  return request('/admin/questionManagement/updateCommonQuestionCategory', {
    method: 'POST',
    data,
  });
}

// post FAQ - 问题分类 - 删除
export function fetchFAQSortDel(data) {
  return request('/admin/questionManagement/deleteCommonQuestionCategory', {
    method: 'POST',
    data,
  });
}

// post FAQ - 问题分类 - 排序
export function fetchFAQClassSort(data) {
  return request('/admin/questionManagement/sortCommonQuestionCategory', {
    method: 'POST',
    data,
  });
}

// FAQ end

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

// post 消息推送 - 新增并推送
export function fetchMsgAddAndPush(data) {
  return request('/admin/messagePushManagement/createAndPushUserMessagePush', {
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
