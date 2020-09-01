import request from '@/utils/request';

// get 用户账户 - 账户列表
export async function fetchAccountUserList(params) {
  return request('/admin/userManagement/getUserByMobile', {
    params,
  });
}

// get 用户账户 - 获取统计信息
export async function fetchAccountUserTotal(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}

// get 用户账户 - 卡豆明细
export async function fetchUserPeasDetail(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}

// get 用户账户 - 充值记录
export async function fetchUserRechargeDetail(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}

// get 用户账户 - 订单详情
export async function fetchUserOrderDetail(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}

// get 商家账户 - 账户列表
export async function fetchAccountBusinessList(params) {
  return request('/admin/auth/getOwnInfos', {
    params,
  });
}

// get 商家账户 - 获取统计信息
export async function fetchAccountBusinessTotal(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}

// get 商家账户 - 卡豆明细
export async function fetchBusinessPeasDetail(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}

// get 商家账户 - 提现记录
export async function fetchBusinessCollectDetail(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}

// get 商家账户 - 充值记录
export async function fetchBusinessRechargeDetail(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}

// get 商家账户 - 订单详情
export async function fetchBusinessOrderDetail(params) {
  return request('/admin/auth/getOwnInfo', {
    params,
  });
}
