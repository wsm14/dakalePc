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
