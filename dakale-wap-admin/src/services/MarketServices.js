import request from '@/utils/request';

// 区域查询系统

// get 区域查询系统 - 获取详情
export function fetchAreaQueryInfo(params) {
  return request('/admin/agentPrice/listAgentPriceByPid', {
    params,
  });
}

// post 区域查询系统 - 签约 修改代理商价格
export function fetchAreaQueryInfoSet(data) {
  return request('/admin/agentPrice/updateAgentPrice', {
    method: 'POST',
    data,
  });
}

// 区域查询系统 end
