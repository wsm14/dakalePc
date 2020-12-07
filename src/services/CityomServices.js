import request from '@/utils/request';


// 省公司列表

// get 省公司列表 - 列表
export function fetchProvList(params) {
  return request('/admin/company/listCompany', {
    params,
  });
}


// 省公司列表 end
// 加盟申请

// get 加盟申请 - 列表
export function fetchFranchiseAppList(params) {
  return request('/admin/cityOperationManagement/listUserApply', {
    params,
  });
}

// post 加盟申请 - 处理
export function fetchFranchiseHandle(data) {
  return request('/admin/cityOperationManagement/updateUserApply', {
    method: 'POST',
    data,
  });
}

// 加盟申请 end

