import request from '@/utils/request';

// 全局接口

// get 日志记录
export function fetchHandleDetail(params) {
  return request('/admin/logRecord/listLogRecord', {
    params,
  });
}

// get 获取配置文件
export function fetchGetPropertyJSON(params) {
  return request('/common/property/getLastProperty', {
    params,
  });
}

// get 获取手机号归属地
export function fetchGetPhoneComeLocation(params) {
  return request('/common/ocr/getMobileInfo', {
    params,
  });
}

// get OCR识别 营业执照
export function fetchGetOcrLicense(params) {
  return request('/common/ocr/businessLicense', {
    params,
  });
}

// get OCR识别 银行卡
export function fetchGetOcrIdBankCard(params) {
  return request('/common/ocr/bankCard', {
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
  return request('/admin/businessHub/listBusinessHubByCode', {
    params,
  });
}

// get 获取商圈名称
export function fetchGetHubName(params) {
  return request('/admin/businessHub/getBusinessHubById', {
    params,
  });
}

// get 店铺标签
export function fetchGetMreTag(params) {
  return request('/admin/systemConfig/listConfigMerchantTag', {
    params,
  });
}

// get 行业类目 - 勾选列表
export function fetchGetTradeSelect(params) {
  return request('/common/category/listSpecialGoodsCategory', {
    params,
  });
}

// post 行业类目 - 勾选设置
export function fetchSetTradeSelect(data) {
  return request('/common/category/setSpecialGoodsCategory', {
    method: 'POST',
    data,
  });
}

// post 校验店铺是否存在
export function fetchMerCheckData(data) {
  return request('/admin/merchantManagement/repeatStoreVerification', {
    method: 'POST',
    data,
  });
}

// get 获取兴趣标签
export function fetchGetTasteTag(params) {
  return request('/common/domain/listDomain', {
    params,
  });
}

// get 获取哒人等级对应名称
export function fetchGetKolLevel(params) {
  return request('/admin/systemConfig/listLevelAndLevelName', {
    params,
  });
}
