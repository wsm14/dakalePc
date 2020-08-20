import request from '@/utils/request';

// get 问题反馈 - 列表
export async function fetchFeedBackList(params) {
  return request('/admin/marketingManagement/pageUserMatchByDateAndType', {
    params,
  });
}

// get 问题反馈 - 反馈详情
export async function fetchFeedBackDetail(params) {
  return request('/admin/marketingManagement/pageUserMatchByDateAndType', {
    params,
  });
}

// post 问题反馈 - 确认反馈
export function fetchFeedBackPush(data) {
  return request('/admin/marketingActivity/updateActivity', {
    method: 'POST',
    data,
  });
}
