import request from '@/utils/request';

// 哒小卡点位管理

// get 哒小卡点位管理 - 列表
export async function fetchListHittingMain(params) {
  return request('/admin/hittingMain/listHittingMain', {
    params,
  });
}

// 哒小卡点位管理 end
