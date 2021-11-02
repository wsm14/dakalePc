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

// get 用户账户 - 卡豆明细 -奖励卡豆
export async function fetchUserPeasDetail(params) {
  return request('/admin/accountManagement/listUserBeanDetail', {
    params,
  });
}
//用户收益卡豆明细
export async function fetchUserIncomeBeanDetail(params) {
  return request('/admin/accountManagement/listUserIncomeBeanDetail', {
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

// * 商家营销卡豆明细
export async function fetchBusinessPlatformBeanDetail(params) {
  return request('/admin/accountManagement/listMerchantPlatformBeanDetail', {
    params,
  });
}

// get 商家账户 - 提现记录
export async function fetchBusinessCollectDetail(params) {
  return request('/admin/accountManagement/listMerchantWithdrawalDetail', {
    params,
  });
}

// get 商家账户 - 现金账户明细
export async function fetchBusinessCashDetail(params) {
  return request('/admin/accountManagement/listMerchantBeanDirectDetail', {
    params,
  });
}

// get 商家账户 - 充值记录
export async function fetchBusinessRechargeDetail(params) {
  return request('/admin/accountManagement/listUserChargeRecord', {
    params,
  });
}

// get 补贴店铺 - 列表
export async function fetchSubsidyShopList(params) {
  return request('/admin/subsidyStatistic/subsidyStatistic', {
    params,
  });
}

// 补贴详情
export async function fetchSubsidyStatisticDetail(params) {
  return request('/admin/subsidyStatistic/subsidyStatisticDetail', {
    params,
  });
}

// 集团账户 列表
export async function fetchListMerchantGroupAccount(params) {
  return request('/admin/merchantGroup/listMerchantGroupAccount', {
    params,
  });
}
