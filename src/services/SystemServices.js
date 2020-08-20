import request from '@/utils/request';

// get 帐号设置 - 帐号 -  获取登录账户权限菜单
export function fetchMenuList(params) {
  return request('/merchant/auth/getAccessTree', {
    params,
  });
}

// get 帐号设置 - 角色 - 获取角色列表
export function fetchRoleList(params) {
  return request('/admin/auth/listRole', {
    params,
  });
}

// get 帐号设置 - 帐号 - 获取管理员列表
export function fetchSysAccountList(params) {
  return request('/admin/auth/listAdmin', {
    params,
  });
}

// get 帐号设置 - 角色 - 获取角色信息
export function fetchGetRoleInfo(params) {
  return request('/admin/auth/getRoleInfo', {
    params,
  });
}

// get 帐号设置 - 帐号 - 获取管理员账户信息
export function fetchGetAccountInfo(params) {
  return request('/admin/auth/getAdminInfo', {
    params,
  });
}

// post 帐号设置 - 角色 - 新增修改角色信息
export function fetchRoleEdit(data) {
  return request('/admin/auth/saveAuthRole', {
    method: 'POST',
    data,
  });
}

// post 帐号设置 - 帐号 - 新增修改管理员帐号
export function fetchAccountEdit(data) {
  return request('/admin/auth/saveAuthAdmin', {
    method: 'POST',
    data,
  });
}

// get App设置 - 图片列表
export function fetchBannerList(params) {
  return request('/admin/auth/saveAasdauthRodle', {
    params,
  });
}

// get App设置 - 获取图片详情
export function fetchBannerDetail(params) {
  return request('/admin/auth/saveAuthRodle', {
    params,
  });
}

// post App设置 - 图片下架
export function fetchBannerStatus(data) {
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}

// post App设置 - 图片删除
export function fetchBannerDel(data) {
  return request('/admin/auth/saveAuthdsfRole', {
    method: 'POST',
    data,
  });
}

// post App设置 - 图片新增
export function fetchBannerSet(data) {
  return request('/admin/auth/saveAuthdsfRole', {
    method: 'POST',
    data,
  });
}

// get 卡豆分享 - 列表
export function fetchPeasShareList(params) {
  return request('/admin/auth/saveAuthRodle', {
    params,
  });
}

// get 卡豆分享 - 获取修改详情
export function fetchPeasShareDetail(params) {
  return request('/admin/auth/saveAuthRodle', {
    params,
  });
}

// post 卡豆分享 - 新增
export function fetchPeasShareAdd(data) {
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}

// post 卡豆分享 - 修改
export function fetchPeasShareEdit(data) {
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}

// post 卡豆分享 - 删除
export function fetchPeasShareDel(data) {
  return request('/admin/auth/saveAfuthRole', {
    method: 'POST',
    data,
  });
}
