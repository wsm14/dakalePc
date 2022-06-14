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

// get 达人列表 - 获取哒人标识
export function fetchDarenTag(params) {
  return request('/admin/dictionaryAdmin/getDictionaryAdmin', {
    params,
  });
}

// get 达人列表 - 获取BD列表
export function fetchGetBDList(params) {
  return request('/admin/sell/getSell', {
    params,
  });
}

// post 达人列表 - 设置BD
export function fetchGetBDSet(data) {
  return request('/admin/userManagement/updateUserSellId', {
    method: 'POST',
    data,
  });
}

// post 达人列表 - 设置哒人标识
export function fetchDarenTagSet(data) {
  return request('/admin/kol/setUserIdentification', {
    method: 'POST',
    data,
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

// 哒人业绩

// get 哒人业绩
export function fetchExpertUserAchievementList(params) {
  return request('/admin/kol/listKolPerformance', {
    params,
  });
}

// get 哒人业绩 - 推荐列表
export function fetchExpertUserAchievementRecommend(params) {
  return request('/admin/kol/listKolRecommended', {
    params,
  });
}

// get 哒人业绩 - 分佣统计
export function fetchExpertUserSubCommissionStatistics(params) {
  return request('/admin/kol/monthStatisticKolCommission', {
    params,
  });
}

// get 哒人业绩统计
export function fetchExpertUserAchievementTotalList(params) {
  return request('/admin/achievement/daren', {
    params,
  });
}

// post 哒人业绩统计 - 导出
export function fetchExcelImportExcel(data) {
  return request('/admin/excelImport/importExcel', {
    method: 'POST',
    data,
  });
}

// 哒人业绩 end

// 团购业绩

// get 团购业绩 - 团购业绩统计列表
export function fetchCombineBuyList(params) {
  return request('/admin/communityConsume/performanceStatistics', {
    params,
  });
}

// post 团购业绩 - 导出
export function fetchCombineBuyImportExcel(data) {
  return request('/admin/excelImport/importExcel', {
    method: 'POST',
    data,
  });
}

// 团购业绩 end

// 哒人分销明细

// get 哒人分销明细 - 统计
export function fetchExpertUserDistributionList(params) {
  return request('/admin/kol/listKolDistributionDetails', {
    params,
  });
}

// 哒人分销明细 end

// 实习豆长

// get 实习豆长 - 统计
export function fetchExpertTempList(params) {
  return request('/admin/userTempLevel/listUserTempLevel', {
    params,
  });
}

// post 实习豆长 - 新增实习
export function fetchExpertTempAdd(data) {
  return request('/admin/userTempLevel/saveUserTempLevel', {
    method: 'POST',
    data,
  });
}

// post 实习豆长 - 停止实习
export function fetchExpertTempStop(data) {
  return request('/admin/userTempLevel/cancelUserTempLevel', {
    method: 'POST',
    data,
  });
}

// 实习豆长 end
