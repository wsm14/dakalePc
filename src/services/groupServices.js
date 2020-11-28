import request from '@/utils/request';

// get 达人列表 - 统计
export function fetchMerchantGroup(params) {
  return request('/admin/merchantGroup/listMerchantGroup', {
    params,
  });
}
//获取集团列表

// post 达人管理 - 话题设置 删除 修改 推荐
export function fetchAddMerchantGroup(data) {
  return request('/admin/merchantGroup/saveMerchantGroup', {
    method: 'POST',
    data,
  });
}
//新增集团
export function fetchGetOcrBusinessLicense(params) {
  return request('/common/ocr/businessLicense', {
    params,
  });
}
//ocr 印业执照
export function fetchGetOcrBankLicense(params) {
  return request('/common/ocr/bankLicense', {
    params,
  });
}
//ocr 开户行
export function fetchGetOcrIdCardFront(params) {
  return request('/common/ocr/idCardFront', {
    params,
  });
}
//ocr 身份证正面
export function fetchGetOcrIdCardBack(params) {
  return request('/common/ocr/idCardBack', {
    params,
  });
}
//ocr 身份证反面

export function fetchMerchantBank(data) {
  return request('/admin/merchantGroup/bindingBankInfo', {
    method: 'POST',
    data,
  });
}
//绑定银行卡

export function fetchWMSUserRoles(params) {
  return request('/admin/role/listAuthRoleAll', {
    params,
  });
}
//获取角色列表

export function fetchGrounpDetails(params) {
  return request('/admin/merchantGroup/merchantGroupDetail', {
    params,
  });
}
//获取集团详情
export function fetchUpdateGroup(data) {
  return request('/admin/merchantGroup/updateMerchantGroup', {
    method: 'POST',
    data,
  });
}
