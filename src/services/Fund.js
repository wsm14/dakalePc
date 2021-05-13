import request from '@/utils/request';

// get 提现规则
export function fetchWithdrawRegularList(params) {
  return request(' /admin/systemConfig/listConfigWithdraw', {
    params,
  });
}
//post 新增编辑

export function fetchWithdrawUpdate(data) {
  return request('/admin/systemConfig/saveOrUpdateConfigWithdraw', {
    method: 'POST',
    data,
  });
}
