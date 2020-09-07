import request from '@/utils/request';

// get 用户列表 - 用户列表
export function fetchUserList(params) {
  return request('/admin/userManagement/getUserByMobile', {
    params,
  });
}

// get 用户列表 - 用户详情
export function fetchUserDetail(params) {
  return request('/admin/userManagement/getUserDetail', {
    params,
  });
}

// get 用户列表 - 用户统计
export function fetchUserTotal(params) {
  return request('/admin/userManagement/getUserStatisticTotal', {
    params,
  });
}

// get 用户列表 - 用户新增用户统计
export function fetchUserAddTotal(params) {
  return request('/admin/userManagement/getUserStatistic', {
    params,
  });
}

// get 用户列表 - 用户地区用户统计
export function fetchUserCityTotal(params) {
  return request('/admin/userManagement/getUserCityStatistic', {
    params,
  });
}

// post 用户列表 - 用户启用禁用
export function fetchUserStatus(data) {
  return request('/admin/userManagement/updateUserStatus', {
    method: 'POST',
    data,
  });
}
