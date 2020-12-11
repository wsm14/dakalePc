import request from '@/utils/request';

// 全局接口

// get 日志记录
export function fetchHandleDetail(params) {
  return request('/user/logRecord/listLogRecord', {
    params,
  });
}

// get OCR识别 营业执照
export function fetchGetOcrLicense(params) {
  return request('/common/ocr/businessLicense', {
    params,
  });
}

// get OCR识别 开户行
export function fetchGetOcrBank(params) {
  return request('/common/ocr/bankLicense', {
    params,
  });
}

// get OCR识别 身份证正面
export function fetchGetOcrIdCardFront(params) {
  return request('/common/ocr/idCardFront', {
    params,
  });
}

// get OCR识别 身份证反面
export function fetchGetOcrIdCardBack(params) {
  return request('/common/ocr/idCardBack', {
    params,
  });
}

// get 获取商圈
export function fetchGetHubSelect(params) {
  return request('/common/businessHub/listBusinessHubByCode', {
    params,
  });
}

// get 获取商圈名称
export function fetchGetHubName(params) {
  return request('/common/businessHub/getBusinessHubById', {
    params,
  });
}

// get 周边特惠 - 行业类目
export function fetchSpecialClassisyList(params) {
  return request('/common/category/listSpecialGoodsCategoryAdmin', {
    params,
  });
}
