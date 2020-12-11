import request from '@/utils/request';

// 哒人列表

// get 达人列表 - 统计
export function fetchExpertUserTotal(params) {
  return request('/admin/kol/countKol', {
    params,
  });
}

// get 达人列表 - 列表
export function fetchExpertUserList(params) {
  return request('/admin/kol/listKolManagement', {
    params,
  });
}

// post 达人列表 - 封停哒人
export function fetchExpertStop(data) {
  return request('/admin/kol/suspendKol', {
    method: 'POST',
    data,
  });
}

// post 达人列表 - 解封哒人
export function fetchExpertOpen(data) {
  return request('/admin/kol/unblockKol', {
    method: 'POST',
    data,
  });
}

// 哒人列表 end

// 种草管理

// get 种草管理 - 列表
export function fetchExpertRemdList(params) {
  return request('/admin/kolMoments/listKolMomentsManagement', {
    params,
  });
}

// get 种草管理 - 详情
export function fetchExpertRemdDetail(params) {
  return request('/admin/kolMoments/kolMomentsDetail', {
    params,
  });
}

// post 种草管理 - 上下架
export function fetchExpertRemdStatus(data) {
  return request('/admin/kolMoments/kolMomentsDropOff', {
    method: 'POST',
    data,
  });
}

// get 种草管理 - 举报列表
export function fetchExpertReportList(params) {
  return request('/user/userReport/listUserReport', {
    params,
  });
}

// post 种草管理 - 举报列表 - 处理举报
export function fetchExpertProcessReport(data) {
  return request('/user/userReport/processUserReport', {
    method: 'POST',
    data,
  });
}

// 种草管理 end

// get 达人管理 - 创作设置
export function fetchExpertSetList(params) {
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

// 排序机制

// get 排序机制 - 列表
export function fetchExpertSortList(params) {
  return request('/admin/userManagement/getUserLevelSortConfig', {
    params,
  });
}

// post 排序机制 - 设置
export function fetchExpertSortSet(data) {
  return request('/admin/userManagement/saveUserLevelSortConfig', {
    method: 'POST',
    data,
  });
}

// 排序机制 end

// 等级设置

// get 等级设置 - 列表
export function fetchExpertLevelList(params) {
  return request('/admin/userLevelManagement/listLevelConfig', {
    params,
  });
}

// 等级设置 end
