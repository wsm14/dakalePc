import request from '@/utils/request';

// 区域战报

// get 获取登录账户权限菜单
export function fetchAreaTotalList(params) {
  return request('/admin/areaStatistic/areaStatistic', {
    params,
  });
}

// 区域战报 end

// post 登录
export function fakeAccountLogin(data) {
  return request('/admin/admin/account/login', {
    method: 'POST',
    data,
  });
}
