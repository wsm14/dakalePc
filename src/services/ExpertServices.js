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

// post 达人管理 - 创作设置 删除 修改 推荐
export function fetchClassifyDetailSet(data) {
  return request('/admin/topic/updateTopic', {
    method: 'POST',
    data,
  });
}

// 排序机制

// get 排序机制 - 列表
export function fetchExpertSortList(params) {
  return request('/admin/systemConfig/getUserLevelSortConfig', {
    params,
  });
}

// post 排序机制 - 设置
export function fetchExpertSortSet(data) {
  return request('/admin/systemConfig/saveUserLevelSortConfig', {
    method: 'POST',
    data,
  });
}

// 排序机制 end

// 等级设置

// get 等级设置 - 列表
export function fetchExpertLevelList(params) {
  return request('/admin/systemConfig/listLevelConfig', {
    params,
  });
}

// post 等级设置 - 设置
export function fetchExpertLevelSet(data) {
  return request('/admin/systemConfig/saveLevelConfig', {
    method: 'POST',
    data,
  });
}

// 等级设置 end

// 哒人配置

// get 哒人配置 - 列表
export function fetchExpertAllocationList(params) {
  return request('/admin/systemConfig/listUserLevel', {
    params,
  });
}

// post 哒人配置 - 新增
export function fetchExpertAllocationSave(data) {
  return request('/admin/systemConfig/saveUserLevel', {
    method: 'POST',
    data,
  });
}

// post 哒人配置 - 修改
export function fetchExpertAllocationEdit(data) {
  return request('/admin/systemConfig/updateUserLevel', {
    method: 'POST',
    data,
  });
}

// 哒人配置 end

// 哒人业绩

// get 哒人业绩 - 统计
export function fetchExpertUserAchievementList(params) {
  return request('/admin/kol/listKolPerformance', {
    params,
  });
}

// 哒人业绩 end

// 哒人分销明细

// get 哒人分销明细 - 统计
export function fetchExpertUserDistributionList(params) {
  return request('/admin/kol/listKolDistributionDetails', {
    params,
  });
}

// 哒人分销明细 end
