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

// 用户数据统计

// get 用户数据统计 - 获取数据对象
export function fetchUserAnalysisReport(params) {
  return request('/admin/userReportManagement/userAnalysisReport', {
    params,
  });
}

// get 用户数据统计 - 用户画像 - 性别及年龄分布
export function fetchUserStatisticReport(params) {
  return request('/admin/userReportManagement/userStatisticReport', {
    params,
  });
}

// get 用户数据统计 - 用户画像 - 地区分布
export function fetchUserPortraitAreaReport(params) {
  return request('/admin/userReportManagement/userPortraitAreaReport', {
    params,
  });
}

// get 用户数据统计 - 累计数据
export function fetchUserAccumulativeReport(params) {
  return request('/admin/userReportManagement/userAccumulativeReport', {
    params,
  });
}

// get 用户数据统计 - 渠道统计
export function fetchUserChannelStatisticsReport(params) {
  return request('/admin/userReportManagement/userChannelStatisticsReport', {
    params,
  });
}

// get 用户数据统计 - 渠道趋势-对比
export function fetchUserChannelContrastReport(params) {
  return request('/admin/userReportManagement/userChannelContrastReport', {
    params,
  });
}

// 用户数据统计 end

// 视频数据统计

// get 视频数据统计 - 趋势分析
export function fetchMomentTrendAnalysisReport(params) {
  return request('/admin/momentReportManagement/momentTrendAnalysisReport', {
    params,
  });
}

// get 视频数据统计 - 视频数量
export function fetchMomentNumAnalysisReport(params) {
  return request('/admin/momentReportManagement/momentNumAnalysisReport', {
    params,
  });
}

// get 视频数据统计 - 播放分析
export function fetchMomentPlayAnalysisReport(params) {
  return request('/admin/momentReportManagement/momentPlayAnalysisReport', {
    params,
  });
}

// get 视频数据统计 - UGC视频打赏情况
export function fetchMomentRewardAnalysisReport(params) {
  return request('/admin/momentReportManagement/momentRewardAnalysisReport', {
    params,
  });
}

// 视频数据统计 end

// 订单数据统计

// get 订单数据统计 - 趋势分析
export function fetchOrderTrendAnalysisReport(params) {
  return request('/admin/orderReportManagement/orderTrendAnalysisReport', {
    params,
  });
}

// get 订单数据统计 - 支付金额分析
export function fetchOrderPayAnalysisReport(params) {
  return request('/admin/orderReportManagement/orderPayAnalysisReport', {
    params,
  });
}

// get 订单数据统计 - 交易转化分析
export function fetchOrderConvertAnalysisReport(params) {
  return request('/admin/orderReportManagement/orderConvertAnalysisReport', {
    params,
  });
}

// get 订单数据统计 - 卡豆抵扣情况
export function fetchOrderBeanAnalysisReport(params) {
  return request('/admin/orderReportManagement/orderBeanAnalysisReport', {
    params,
  });
}

// get 订单数据统计 - 地区占比
export function fetchOrderAreaAnalysisReport(params) {
  return request('/admin/orderReportManagement/orderAreaAnalysisReport', {
    params,
  });
}

// 订单数据统计 end

// 拼团统计  start
// 拼团累计数据
export function fetchTogetherRebateStatistic(params) {
  return request('/admin/togetherReportManagement/togetherRebateStatistic', {
    params,
  });
}

//拼团报表
export function fetchTogetherRebateReport(params) {
  return request('/admin/togetherReportManagement/togetherRebateReport', {
    params,
  });
}
// 拼团统计  end