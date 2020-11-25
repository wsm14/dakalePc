import request from '@/utils/request';

// 权限获取选择框

// get 根据权限获取 - 部门列表
export function fetchGetSectionRole(params) {
  return request('/admin/department/listDepartmentByToken', {
    params,
  });
}

// get 根据权限获取 - 用户列表
export function fetchGetUserRole(params) {
  return request('/admin/auth/admin/listAuthAdminByName', {
    params,
  });
}
// end

// get 员工管理 - 用户列表
export function fetchWMSUserList(params) {
  return request('/admin/auth/admin/listAuthAdmin', {
    params,
  });
}

// get 员工管理 - 用户列表 - 获取角色选择
export function fetchWMSUserRoles(params) {
  return request('/admin/role/listAuthRoleAll', {
    params,
  });
}

// get 员工管理 - 用户列表 - 获取用户详情
export function fetchWMSUserDetail(params) {
  return request('/admin/auth/admin/getAuthAdminDetail', {
    params,
  });
}

// post 员工管理 - 用户新增
export function fetchWMSUserAdd(data) {
  return request('/admin/auth/admin/saveAuthAdmin', {
    method: 'POST',
    data,
  });
}

// post 员工管理 - 用户修改
export function fetchWMSUserEdit(data) {
  return request('/admin/auth/admin/updateAuthAdmin', {
    method: 'POST',
    data,
  });
}

// get 员工管理 - 角色可选搜索
// export function fetchWMSRoleSelect(params) {
//   return request('/common/dictionary/listAvailableRoles', {
//     params: { parent: 'sell' },
//   });
// }

// get 员工管理 - 角色列表
export function fetchWMSRoleList(params) {
  return request('/admin/role/listAuthRole', {
    params,
  });
}

// get 员工管理 - 角色列表 - 获取角色详情
export function fetchWMSRoleDetail(params) {
  return request('/admin/role/roleDetail', {
    params,
  });
}

// post 员工管理 - 角色新增
export function fetchWMSRoleAdd(data) {
  return request('/admin/role/saveAuthRole', {
    method: 'POST',
    data,
  });
}

// post 员工管理 - 角色修改
export function fetchWMSRoleEdit(data) {
  return request('/admin/role/updateAuthRole', {
    method: 'POST',
    data,
  });
}

// get 员工管理 - 部门列表
export function fetchWMSSectionList(params) {
  return request('/admin/department/listDepartment', {
    params,
  });
}

// get 员工管理 - 部门新增
export function fetchWMSSectionAdd(data) {
  return request('/admin/department/saveDepartment', {
    method: 'POST',
    data,
  });
}

// get 员工管理 - 部门修改
export function fetchWMSSectionEdit(data) {
  return request('/admin/department/updateDepartment', {
    method: 'POST',
    data,
  });
}

// get 规则设置 - 获取规则菜单
export function fetchRulesList(params) {
  return request('/admin/sellRule/listSellRule', {
    params,
  });
}

// get 规则设置 - 获取规则列表
export function fetchRulesDetail(params) {
  return request('/admin/sellRuleDetail/listSellRuleDetail', {
    params,
  });
}

// post 规则设置 - 新增 / 修改规则
export function fetchRulesEdit(data) {
  return request('/admin/sellRuleDetail/saveSellRuleDetail', {
    method: 'POST',
    data,
  });
}
export function fetchUserListByCompany(params) {
  return request('/admin/auth/company/listAuthCompany', {
    params,
  });
}
//get  获取省代理角色
export function fetchUserEditByCompany(data) {
  return request('/admin/auth/company/updateAuthCompany', {
    method: 'POST',
    data,
  });
}
//修改省代信息

export function fetchUserDetailsByCompany(params) {
  return request('/admin/auth/company/getAuthCompanyDetail', {
    params,
  });
}
//根据Id获取省代角色详情
export function fetchUserAddByCompany(data) {
  return request('/admin/auth/company/saveAuthCompany', {
    method: 'POST',
    data,
  });
}
//新增省代用户

export function fetchUserListByPartner(params) {
  return request('/admin/auth/partner/listAuthPartner', {
    params,
  });
}
//get  获取区域代理角色
export function fetchUserEditByPartner(data) {
  return request('/admin/auth/partner/updateAuthPartner', {
    method: 'POST',
    data,
  });
}
//修改代理 信息

export function fetchUserDetailsByPartner(params) {
  return request('/admin/auth/partner/getAuthPartnerDetail', {
    params,
  });
}
//根据Id获取省代角色详情
export function fetchUserAddByPartner(data) {
  return request('/admin/auth/partner/saveAuthPartner', {
    method: 'POST',
    data,
  });
}
//新增省代用户
