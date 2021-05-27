import request from '@/utils/request';

// 全局接口

// get 获取哒人等级映射 - 等同哒人配置列表
export function fetchGetExpertLevel(params) {
  return request('/admin/systemConfig/listUserLevel', {
    params,
  });
}

// get 获取补贴卡豆类型的卡豆数
export function fetchGetSubsidyRoleBean(params) {
  return request('/admin/systemConfig/getByCategoryIdAndSubsidyRoleAndType', {
    params,
  });
}

// get 店铺选择免费券列表
export function fetchGetFreeCouponSelect(params) {
  return request('/admin/coupon/listOwnerCouponByChannel', {
    params,
  });
}

// get 店铺选择有价券列表
export function fetchGetBuyCouponSelect(params) {
  return request('/admin/coupon/listOwnerCouponNeedBuy', {
    params,
  });
}

// get 店铺特惠商品列表
export function fetchGetSpecialGoodsSelect(params) {
  return request('/admin/specialGoodsManagement/listMerchantSpecialGoods', {
    params,
  });
}

// get 全部的订单查询 全局
export function fetchOrderDetail(params) {
  return request('/admin/accountManagement/getRelatedOrderDetail', {
    params,
  });
}

// get 日志记录
export function fetchHandleDetail(params) {
  return request('/admin/logRecord/listLogRecord', {
    params,
  });
}

// get 日志记录 - 新
export function fetchGetLogDetail(params) {
  return request('/admin/actionLog/listActionLog', {
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

// get 店铺标签
export function fetchGetMreTag(params) {
  return request('/admin/systemConfig/listConfigMerchantTag', {
    params,
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

// get 可跳转app选项列表
export function fetchGetJumpNative(params) {
  return request('/admin/native/jump/listNativeJump', {
    params,
  });
}

// post 数据明细查询 全局导出
export function fetchimportExcel(data) {
  return request('/admin/excelImport/importExcel', {
    method: 'POST',
    data,
  });
}

// get 导出列表
export function fetchimportExcelList(params) {
  return request('/admin/excelImport/listExcelImport', {
    params,
  });
}

// get 获取可选用户列表
export function fetchGetSelectUserList(params) {
  return request('/admin/userManagement/listUserManagement', {
    params,
  });
}