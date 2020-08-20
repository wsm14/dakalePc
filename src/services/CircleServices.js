import request from '@/utils/request';

// get 家主列表 - 统计数据
export async function fetchMasterTotal(params) {
  return request('/admin/auth/getOwnInfos', {
    params,
  });
}

// get 家主列表 - 列表
export async function fetchMasterList(params) {
  return request('/admin/auth/getOwnInfos', {
    params,
  });
}

// get 家主列表 - 家人列表
export async function fetchMasterFamily(params) {
  return request('/admin/auth/fetchMasterFamily', {
    params,
  });
}

// get 家主列表 - 家店列表
export async function fetchMasterShop(params) {
  return request('/admin/auth/fetchMasterShop', {
    params,
  });
}

// get 家主列表 - 收益明细
export async function fetchMasterIncomeDetails(params) {
  return request('/admin/auth/fetchMasterIncomeDetails', {
    params,
  });
}
