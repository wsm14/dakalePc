import request from '@/utils/request';

// 运营看板
export function fetchSaleBlock(params) {
  return request('/admin/emergency/data/byDate', {
    params,
  });
}

// 区域战报

// get 获取登录账户权限菜单
export function fetchAreaTotalList(params) {
  return request('/admin/areaStatistic/areaStatistic', {
    params,
  });
}

// 区域战报 end

// 数据概览

// get 顶部 - 订单统计（旧的）
export function fetchChartBlockOrder(params) {
  return request('/admin/areaStatistic/orderStatistic', {
    params,
  });
}

// get 顶部 - GMV等各项数据统计
export function fetchChartBusinessStatistic(params) {
  return request('/admin/dataStatistic/businessStatistic', {
    params,
  });
}

// get 顶部 - 用户数据
export function fetchChartBlockUser(params) {
  return request('/admin/areaStatistic/userStatistic', {
    params,
  });
}

// get 中部 - 店铺视频分享统计
export function fetchChartBlockMreShare(params) {
  return request('/admin/areaStatistic/getMomentStatistic', {
    params,
  });
}

// get 中部 - 销售统计
export function fetchChartBlockSale(params) {
  return request('/admin/areaStatistic/getStatistic', {
    params,
  });
}

// get 中部 - 店铺情况
export function fetchChartBlockAreaMer(params) {
  return request('/admin/areaStatistic/getAreaMerchantStatistic', {
    params,
  });
}

// get 中部 - 圈层数据
export function fetchChartMasterData(params) {
  return request('/admin/areaStatistic/getFamilyStatistic', {
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

// get 地图 - 获取区域商圈 - 散点
export function fetchChartMapHubMre(params) {
  return request('/admin/areaStatistic/getMerchantMapDetail', {
    params,
  });
}

// get 地图 - 获取区域商圈 - 商家详情
export function fetchChartMapHubMreDeatil(params) {
  return request('/admin/areaStatistic/getMerchantDetail', {
    params,
  });
}

// 数据概览 end

// 视频看板

// get 视频看板 - 获取数据对象
export function fetchMomentKanBan(params) {
  return request('/admin/momentStatistic/momentKanBan', {
    params,
  });
}

// 视频看板 end
