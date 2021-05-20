import request from '@/utils/request';

// get 用户账户 - 账户列表
export async function fetchAccountUserList(params) {
  return request('/admin/accountManagement/listUserAccount', {
    params,
  });
}

// get 用户账户 - 获取统计信息
export async function fetchAccountUserTotal(params) {
  return request('/admin/accountManagement/getUserBeanStatistic', {
    params,
  });
}

// get 用户账户 - 卡豆明细
export async function fetchUserPeasDetail(params) {
  return request('/admin/accountManagement/listUserBeanDetail', {
    params,
  });
}

// get 用户账户 - 充值记录
export async function fetchUserRechargeDetail(params) {
  return request('/admin/accountManagement/listUserChargeRecord', {
    params,
  });
}

// get 商家账户 - 账户列表
export async function fetchAccountBusinessList(params) {
  return request('/admin/accountManagement/listMerchantAccount', {
    params,
  });
}

// get 商家账户 - 获取统计信息
export async function fetchAccountBusinessTotal(params) {
  return request('/admin/accountManagement/getMerchantBeanStatistic', {
    params,
  });
}

// get 商家账户 - 卡豆明细
export async function fetchBusinessPeasDetail(params) {
  return request('/admin/accountManagement/listMerchantBeanDetail', {
    params,
  });
}

// get 商家账户 - 提现记录
export async function fetchBusinessCollectDetail(params) {
  return request('/admin/accountManagement/listMerchantWithdrawalDetail', {
    params,
  });
}

// get 商家账户 - 充值记录
export async function fetchBusinessRechargeDetail(params) {
  return request('/admin/accountManagement/listUserChargeRecord', {
    params,
  });
}

// 补贴店铺
export async function fetchSubsidyShopList(params) {
  return request('/admin/subsidyStatistic/subsidyStatistic', {
    params,
  });
}

// 补贴店铺详情/admin/subsidyManagement/listSubsidyDetail
export async function fetchSubsidyShopDetailById(params) {  
  return request('/admin/subsidyManagement/listSubsidyDetail', {
    params,
  });
}

// 补贴用户详情

export async function fetchSubsidyUserDetailById(params) {  
  return request('/admin/subsidyStatistic/getUserSubsidyStatisticDetail', {
    params,
  });
}

