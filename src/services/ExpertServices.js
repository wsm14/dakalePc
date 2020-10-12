import request from '@/utils/request';

// get 达人管理 - 创作设置
export async function fetchExpertSetList(params) {
  return request('/admin/domain/listDomain', {
    params,
  });
}

// post 达人管理 - 新增领域
export function fetchExpertAdd(data) {
  return request('/admin/domain/saveDomain', {
    method: 'POST',
    data,
  });
}

// post 达人管理 - 内容分类删除修改
export function fetchClassifyEdit(data) {
  return request('/admin/domain/updateDomain', {
    method: 'POST',
    data,
  });
}

// get 达人管理 - 话题列表
export function fetchClassifyDetailList(params) {
  return request('/admin/topic/listByDomainId', {
    params,
  });
}

// post 达人管理 - 话题新增
export function fetchClassifyDetailAdd(data) {
  return request('/admin/topic/saveTopic', {
    method: 'POST',
    data,
  });
}

// post 达人管理 - 话题设置 删除 修改 推荐
export function fetchClassifyDetailSet(data) {
  return request('/admin/topic/updateTopic', {
    method: 'POST',
    data,
  });
}
