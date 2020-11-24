import request from '@/utils/request';

// post 登录
export function fakeAccountLogin(data) {
  console.log(data)
  return request('/admin/auth/admin/login', {
    method: 'POST',
    data,
  });
}

// get 获取登录账户信息
export async function fetchQueryCurrent() {
  return request('/admin/access/getOwnInfo');
}

// get 获取登录账户权限菜单
export function fetchGetAuthMenuTree(params) {
  return request('/admin/access/getPermissionTree', {
    params,
  });
}
