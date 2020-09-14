import request from '@/utils/request';

// post 登录
export function fakeAccountLogin(data) {
  return request('/admin/auth/doLogin', {
    method: 'POST',
    data,
  });
}

// get 获取登录账户信息
export async function fetchQueryCurrent() {
  return request('/admin/auth/getOwnInfo');
}

// get 获取登录账户权限菜单
export function fetchGetAuthMenuTree(params) {
  return request('/admin/auth/getAccessTree', {
    params,
  });
}
