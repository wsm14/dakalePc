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

// get 获取角色信息
export function fetchGetRoleInfo(params) {
  return request('/admin/auth/getRoleInfo', {
    params,
  });
}

// post 新增修改角色信息
export function fetchRoleEdit(data) {
  return request('/admin/auth/saveAuthRole', {
    method: 'POST',
    data,
  });
}
