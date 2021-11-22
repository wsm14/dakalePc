import request from '@/utils/request';

// 全局接口

// get 获取oss凭证
export async function fetchGetOss(params) {
  return request('/common/oss/getOssPolicy', {
    params,
  });
}

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

// get 店铺权益商品列表
export function fetchGetPlatformEquitySelect(params) {
  return request('/admin/specialGoodsManagement/listSpecialGoodsManagement', {
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

// get 日志记录 - 新   //特惠，券审核记录
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
export function fetchImportExcel(data) {
  return request('/admin/excelImport/importExcel', {
    method: 'POST',
    data,
  });
}

// get 顶部 - 导出列表
export function fetchImportExcelList(params) {
  return request('/admin/excelImport/listExcelImport', {
    params,
  });
}

// get 店铺列表搜索
export function fetchGetMerchantsSearch(params) {
  return request('/admin/merchantManagement/listMerchantUsedToSearch', {
    params,
  });
}

// get 用户列表 - 用于搜索
export function fetchGetUsersSearch(params) {
  return request('/admin/userManagement/listUserUsedToSearch', {
    params,
  });
}
// 集团列表用于搜索
export function fetchGetGroupForSearch(params) {
  return request('/admin/merchantGroup/listGroupForSearch', {
    params,
  });
}

// get 特惠sku通用-集团发布sku时可选商家列表
export function fetchSkuAvailableMerchant(params) {
  return request('/common/sku/config/skuAvailableMerchant', {
    params,
  });
}

// get 优惠券列表 用于运营后台筛选
export function fetchGetCouponsSearch(params) {
  return request('/admin/coupon/listOwnerCouponForSearch', {
    params,
  });
}

// get 特惠商品券搜索 用于运营后台筛选
export function fetchGetGoodsSearch(params) {
  return request('/admin/specialGoodsManagement/listActivityByNameForSearch', {
    params,
  });
}

// get sku通用-审核中sku挂靠商家列表
export function fetchAuditMerchantList(params) {
  return request('/common/sku/config/auditMerchantList', {
    params,
  });
}

// get sku通用-新建sku时可选择商品标签
export function fetchGoodsTagListByCategoryId(params) {
  return request('/common/config/goods/tag/listGoodsTagByCategoryId', {
    params,
  });
}

// get sku通用-是否需要设置佣金
export function fetchGoodsIsCommission(params) {
  return request('/common/sku/config/manuallyCommission', {
    params,
  });
}

// get sku通用-sku挂靠商家列表
export function fetchSkuDetailMerchantList(params) {
  return request('/common/sku/config/skuMerchantList', {
    params,
  });
}

// 根据导入  用户,店铺，集团 匹配后返回
export function fetchListImportSubsidyRole(data) {
  return request('/admin/subsidyManagement/listImportSubsidyRole', {
    method: 'POST',
    data,
  });
}

//通过id list 批量查询用户
export function fetchListUserByIds(data) {
  return request('/admin/userManagement/listUserByIds', {
    method: 'POST',
    data,
  });
}
