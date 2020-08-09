import request from '@/utils/request';

// get 用户列表
export function fetchUserList(params) {
  return request('/admin/userManagement/listUser', {
    params,
  });
}

// get 用户详情
export function fetchUserDetail(params) {
  return request('/admin/userManagement/getUserDetail', {
    params,
  });
}

// post 用户启用禁用
export function fetchUserStatus(data) {
  return request('/admin/userManagement/updateUserStatus', {
    method: 'POST',
    data,
  });
}
