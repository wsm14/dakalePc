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

// 数据概览 end
