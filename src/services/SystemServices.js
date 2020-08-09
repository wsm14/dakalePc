import request from '@/utils/request';

// get 获取登录账户权限菜单
export function fetchMenuList(params) {
  return request('/merchant/auth/getAccessTree', {
    params,
  });
}

// get 获取角色列表
export function fetchRoleList(params) {
  return request('/admin/auth/listRole', {
    params,
  });
}
