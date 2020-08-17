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

// get 获取管理员列表
export function fetchSysAccountList(params) {
  return request('/admin/auth/listAdmin', {
    params,
  });
}

// get 获取角色信息
export function fetchGetRoleInfo(params) {
  return request('/admin/auth/getRoleInfo', {
    params,
  });
}

// get 获取管理员账户信息
export function fetchGetAccountInfo(params) {
  return request('/admin/auth/getAdminInfo', {
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

// post 新增修改管理员帐号
export function fetchAccountEdit(data) {
  return request('/admin/auth/saveAuthAdmin', {
    method: 'POST',
    data,
  });
}
