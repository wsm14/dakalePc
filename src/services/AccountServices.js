import request from '@/utils/request';

// get 用户账户 - 账户列表
export async function fetchAccountUserList() {
  return request('/admin/auth/getOwnInfos');
}

// get 用户账户 - 获取统计信息
export async function fetchAccountUserTotal() {
  return request('/admin/auth/getOwnInfo');
}

// get 商家账户 - 账户列表
export async function fetchAccountBusinessList() {
  return request('/admin/auth/getOwnInfos');
}

// get 商家账户 - 获取统计信息
export async function fetchAccountBusinessTotal() {
  return request('/admin/auth/getOwnInfo');
}
