import request from '@/utils/request';

// 订单数据-销售报表(包括合计项)
export function fetchOrderSalesAnalysisReport(params) {
  return request('/admin/orderReportManagement/orderSalesAnalysisReport', {
    params,
  });
}

// 中奖记录
// get 盲盒中奖记录 - 列表
export function fetchBoxLotteryList(params) {
  return request('/admin/config/blindBox/listUserBlindBoxReward', {
    params,
  });
}
// get 天天抽奖 - 列表
export function fetchGetLuckDrawRecord(params) {
  return request('/admin/luckDraw/getLuckDrawRecord', {
    params,
  });
}

// get 盲盒中奖记录 - 列表导出
export function fetchBoxLotteryExport(params) {
  return request('/admin/config/blindBox/listUserBlindBoxRewardExport', {
    params,
  });
}

// get 盲盒中奖记录 - 查看物流
export function fetchBoxDetail(params) {
  return request('/admin/config/blindBox/viewLogistics', {
    params,
  });
}

// get 盲盒中奖记录 - 发货
export function fetchBoxAddAndPush(data) {
  return request('/admin/config/blindBox/deliverGoods', {
    method: 'POST',
    data,
  });
}

// get 盲盒中奖记录 - 签到游戏/免费领商品(电商品) - 列表
export function fetchListUserPackageManagement(params) {
  return request('/admin/package/listUserPackageManagement', {
    params,
  });
}

// get 盲盒中奖记录 - 签到游戏/免费领商品(电商品) - 列表导出
export function fetchListUserPackageManagementExport(params) {
  return request('/admin/package/listUserPackageManagementExport', {
    params,
  });
}

// get 盲盒中奖记录 - 签到游戏/免费领商品(卡豆权益品) - 列表
export function fetchListUserPackageManagementBean(params) {
  return request('/admin/gameRecord/listGameRecordManagement', {
    params,
  });
}

// get 盲盒中奖记录 - 签到游戏/免费领商品(卡豆权益品) - 列表导出
export function fetchListUserPackageManagementBeanExport(params) {
  return request('/admin/gameRecord/listGameRecordManagementExport', {
    params,
  });
}

//天天抽奖其他导出
export function fetchAllPrizeRecordExport(params) {
  return request('/admin/luckDraw/getAllPrizeRecord', {
    params,
  });
}

// get 盲盒中奖记录 - 签到游戏 - 查看物流
export function fetchGetUserPackageById(params) {
  return request('/admin/package/getUserPackageById', {
    params,
  });
}

// post 盲盒中奖记录 - 签到游戏 - 发货
export function fetchDeliveryUserPackage(data) {
  return request('/admin/package/deliveryUserPackage', {
    method: 'POST',
    data,
  });
}

// get 盲盒中奖记录 - 助力免单 - 列表
export function fetchGetHelpFreeList(params) {
  return request('/admin/userFissionRewardAdmin/pageListUserFissionRewardAdmin', {
    params,
  });
}

// 中奖记录 end

// 助力记录
// get 盲盒助力列表 - 列表
export async function fetchAssistanceList(params) {
  return request('/admin/config/blindBox/listUserBlindBoxHelp', {
    params,
  });
}

// get 盲盒助力列表 - 详情
export async function fetchAssistanceDetail(params) {
  return request('/admin/config/blindBox/boostDetails', {
    params,
  });
}

// get 拉新裂变 - 发起记录 - 列表
export function fetchActivicyAssistanceList(params) {
  return request('/admin/userFissionAdmin/pageListUserFissionAdmin', {
    params,
  });
}

// get 拉新裂变 - 发起记录 - 详情
export function fetchActivicyAssistanceDetail(params) {
  return request('/admin/userFissionHelpAdmin/pageListUserFissionHelpAdmin', {
    params,
  });
}
// 助力记录 end
