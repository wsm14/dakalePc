import request from '@/utils/request';

// 权限获取选择框

// get 根据权限获取 - 部门列表
export function fetchGetSectionRole(params) {
  return request('/sell/department/listDepartmentByToken', {
    params,
  });
}

// get 根据权限获取 - 用户列表
export function fetchGetUserRole(params) {
  return request('/sell/sell/listSellByName', {
    params,
  });
}
// end

// get 员工管理 - 用户列表
export function fetchWMSUserList(params) {
  return request('/sell/sell/listSell', {
    params,
  });
}

// get 员工管理 - 用户列表 - 获取角色选择
export function fetchWMSUserRoles(params) {
  return request('/sell/role/listAuthRoleAll', {
    params,
  });
}

// get 员工管理 - 用户列表 - 获取用户详情
export function fetchWMSUserDetail(params) {
  return request('/sell/sell/getSellDetail', {
    params,
  });
}

// post 员工管理 - 用户新增
export function fetchWMSUserAdd(data) {
  return request('/sell/sell/saveSell', {
    method: 'POST',
    data,
  });
}

// post 员工管理 - 用户修改
export function fetchWMSUserEdit(data) {
  return request('/sell/sell/updateSell', {
    method: 'POST',
    data,
  });
}

// get 员工管理 - 角色可选搜索
export function fetchWMSRoleSelect(params) {
  return request('/common/dictionary/listAvailableRoles', {
    params: { parent: 'sell' },
  });
}

// get 员工管理 - 角色列表
export function fetchWMSRoleList(params) {
  return request('/sell/role/listAuthRole', {
    params,
  });
}

// get 员工管理 - 角色列表 - 获取角色详情
export function fetchWMSRoleDetail(params) {
  return request('/sell/role/roleDetail', {
    params,
  });
}

// post 员工管理 - 角色新增
export function fetchWMSRoleAdd(data) {
  return request('/sell/role/saveAuthRole', {
    method: 'POST',
    data,
  });
}

// post 员工管理 - 角色修改
export function fetchWMSRoleEdit(data) {
  return request('/sell/role/updateAuthRole', {
    method: 'POST',
    data,
  });
}

// get 员工管理 - 部门列表
export function fetchWMSSectionList(params) {
  return request('/sell/department/listDepartment', {
    params,
  });
}

// get 员工管理 - 部门新增
export function fetchWMSSectionAdd(data) {
  return request('/sell/department/saveDepartment', {
    method: 'POST',
    data,
  });
}

// get 员工管理 - 部门修改
export function fetchWMSSectionEdit(data) {
  return request('/sell/department/updateDepartment', {
    method: 'POST',
    data,
  });
}

// get 规则设置 - 获取规则菜单
export function fetchRulesList(params) {
  return request('/sell/sellRule/listSellRule', {
    params,
  });
}

// get 规则设置 - 获取规则列表
export function fetchRulesDetail(params) {
  return request('/sell/sellRuleDetail/listSellRuleDetail', {
    params,
  });
}

// post 规则设置 - 新增 / 修改规则
export function fetchRulesEdit(data) {
  return request('/sell/sellRuleDetail/saveSellRuleDetail', {
    method: 'POST',
    data,
  });
}
