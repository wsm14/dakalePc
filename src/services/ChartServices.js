import request from '@/utils/request';

// 区域战报

// get 获取登录账户权限菜单
export function fetchAreaTotalList(params) {
  return request('/admin/areaStatistic/areaStatistic', {
    params,
  });
}

// 区域战报 end

// 数据概览

// get 顶部 - 订单统计
export function fetchChartBlockOrder(params) {
  return request('/admin/areaStatistic/orderStatistic', {
    params,
  });
}

// get 顶部 - 用户数据
export function fetchChartBlockUser(params) {
  return request('/admin/areaStatistic/userStatistic', {
    params,
  });
}

// get 中部 - 商户视频分享统计
export function fetchChartBlockMreShare(params) {
  return request('/admin/areaStatistic/getMomentStatistic', {
    params,
  });
}

// get 底部 - 行业分布 - left
export function fetchChartBlockTradeLeft(params) {
  return request('/admin/areaStatistic/getMerchantCategoryStatistic', {
    params,
  });
}

// get 底部 - 行业分布 - right
export function fetchChartBlockTradeRight(params) {
  return request('/admin/areaStatistic/getMerchantSubCategoryStatistic', {
    params,
  });
}

// get 底部 - 营收排行 - left
export function fetchChartBlockIncomeLeft(params) {
  return request('/admin/areaStatistic/getMerchantIncomeRank', {
    params,
  });
}

// get 底部 - 销售排行 - right
export function fetchChartBlockSaleRight(params) {
  return request('/admin/areaStatistic/getSaleRank', {
    params,
  });
}

// get 地图 - 获取区域商圈
export function fetchChartMapHub(params) {
  return request('/admin/areaStatistic/getMerchantMap', {
    params,
  });
}

// 数据概览 end
