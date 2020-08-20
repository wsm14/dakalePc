import request from '@/utils/request';

// get 用户账户 - 账户列表
export async function fetchAccountUserList(params) {
  return request('/admin/auth/getOwnInfos', {
    params,
  });
}

// get 用户账户 - 获取统计信息
export async function fetchAccountUserTotal(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}

// get 商家账户 - 账户列表
export async function fetchAccountBusinessList(params) {
  return request('/admin/auth/getOwnInfos', {
    params,
  });
}

// get 商家账户 - 获取统计信息
export async function fetchAccountBusinessTotal(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}
