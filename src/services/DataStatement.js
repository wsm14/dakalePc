import request from '@/utils/request';

// 订单数据-销售报表(包括合计项)
export function fetchOrderSalesAnalysisReport(params) {
  return request('/admin/orderReportManagement/orderSalesAnalysisReport', {
    params,
  });
}
