import request from '@/utils/request';

// 哒小卡点位管理

// get 哒小卡主体点位管理 - 列表
export async function fetchListHittingMain(params) {
  return request('/admin/hittingMain/listHittingMain', {
    params,
  });
}

// post 哒小卡主体点位管理 - 新增
export function fetchSaveHittingMain(data) {
  return request('/admin/hittingMain/saveHittingMain', {
    method: 'POST',
    data,
  });
}

// post 哒小卡主体点位管理 - 编辑
export function fetchUpdateHittingMain(data) {
  return request('/admin/hittingMain/updateHittingMain', {
    method: 'POST',
    data,
  });
}

// get 哒小卡主体点位管理 - 详情
export async function fetchGetHittingMainById(params) {
  return request('/admin/hittingMain/getHittingMainById', {
    params,
  });
}

// get 哒小卡主体点位管理 - 打卡明细
export async function fetchListHittingRecordManagement(params) {
  return request('/admin/hittingMain/listHittingRecordManagement', {
    params,
  });
}

// get 哒小卡点位 - 列表
export async function fetchListHitting(params) {
  return request('/admin/hitting/listHitting', {
    params,
  });
}

// post 哒小卡点位 - 新增
export function fetchSaveHitting(data) {
  return request('/admin/hitting/saveHitting', {
    method: 'POST',
    data,
  });
}

// post 哒小卡点位 - 编辑
export function fetchUpdateHitting(data) {
  return request('/admin/hitting/updateHitting', {
    method: 'POST',
    data,
  });
}

// get 哒小卡点位 - 详情
export async function fetchGetHittingById(params) {
  return request('/admin/hitting/getHittingById', {
    params,
  });
}

// 哒小卡点位管理 end
