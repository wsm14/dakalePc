import request from '@/utils/request';

// get 用户列表 - 用户列表
export function fetchUserList(params) {
  return request('/admin/userManagement/listUserManagement', {
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
  return request('/admin/userManagement/userListManagementStatisticsDay', {
    params,
  });
}

// get 用户列表 - 用户统计
export function fetchUserChartTotal(params) {
  return request('/admin/userManagement/userListManagementStatistics', {
    params,
  });
}

// post 用户列表 - 用户分端口禁用
export function fetchSubPortBlockUser(data) {
  return request('/admin/userManagement/subPortBlockUser', {
    method: 'POST',
    data,
  });
}

// post 用户列表 - 用户分端口解封
export function fetchSubPortUnsealUser(data) {
  return request('/admin/userManagement/subPortUnsealUser', {
    method: 'POST',
    data,
  });
}

// 家主列表

// get 家主列表 - 统计数据
export function fetchMasterTotal(params) {
  return request('/admin/circleManagement/getFamilyStatistic', {
    params,
  });
}

// get 家主列表 - 统计数据
export function fetchMasterTotalList(params) {
  return request('/admin/circleManagement/getFamilyRankStatistic', {
    params,
  });
}

// get 家主列表 - 列表
export function fetchMasterList(params) {
  return request('/admin/circleManagement/getUserCircleDetail', {
    params,
  });
}

// get 家主列表 - 家人列表
export function fetchMasterFamily(params) {
  return request('/admin/circleManagement/listFamilyUser', {
    params,
  });
}

// get 家主列表 - 家店列表
export function fetchMasterShop(params) {
  return request('/admin/circleManagement/listFamilyMerchant', {
    params,
  });
}

// get 家主列表 - 收益明细
export function fetchMasterIncomeDetails(params) {
  return request('/admin/circleManagement/listBeanDetail', {
    params,
  });
}

// 家主列表 end

// BD白名单

// get 限制业务员 - 列表
export async function fetchLimitPopList(params) {
  return request('/admin/recommendReward/listRecommendReward', {
    params,
  });
}

// post 限制业务员 - 新增人员
export function fetchLimitPopAdd(data) {
  return request('/admin/recommendReward/saveRecommendReward', {
    method: 'POST',
    data,
  });
}

// BD白名单 end
