import request from '@/utils/request';

//平台权益

//平台权益end

// 周边特惠

// get 周边特惠 - 列表
export function fetchSpecialGoodsList(params) {
  return request('/admin/specialGoodsManagement/listSpecialGoodsManagement', {
    params,
  });
}

// get 周边特惠 - 详情
export function fetchSpecialGoodsDetail(params) {
  return request('/admin/specialGoodsManagement/getSpecialGoods', {
    params,
  });
}

// get 周边特惠 - 商品码
export function fetchSpecialGoodsQrCode(params) {
  return request('/admin/miniProgramUrl/specialGoodsQcodeUrl', {
    params,
  });
}

// post 周边特惠 - 下架
export function fetchSpecialGoodsStatus(data) {
  return request('/admin/specialGoodsManagement/offShelfSpecialGoods', {
    method: 'POST',
    data,
  });
}

// post 周边特惠 - 编辑
export function fetchSpecialGoodsEdit(data) {
  return request('/admin/specialGoodsManagement/updateSpecialGoods', {
    method: 'POST',
    data,
  });
}

// post 周边特惠 - 审核
export function fetchSpecialGoodsVerify(data) {
  return request('/admin/specialGoodsManagement/simpleVerifySpecialGoods', {
    method: 'POST',
    data,
  });
}

// post 周边特惠 - 删除
export function fetchSpecialGoodsDel(data) {
  return request('/admin/specialGoodsManagement/deleteMerchantSpecialGoods', {
    method: 'POST',
    data,
  });
}

// post 周边特惠 - 新增
export function fetchSpecialGoodsSave(data) {
  return request('/admin/specialGoodsManagement/saveSpecialGoods', {
    method: 'POST',
    data,
  });
}

// post 周边特惠 - 设置推荐
export function fetchSpecialGoodsRecommend(data) {
  return request('/admin/specialGoodsManagement/setRecommend', {
    method: 'POST',
    data,
  });
}
// 周边特惠导出 /
export function fetchSpecialGoodsImport(params) {
  return request('/admin/specialGoodsManagement/listSpecialGoodsManagementImport', {
    params,
  });
}

//周边特惠-取消推荐
export function fetchSpecialCancleRecommend(data) {
  return request('/admin/specialGoodsManagement/cancelRecommend', {
    method: 'POST',
    data,
  });
}

//周边特惠-置顶 资源位
export function fetchSpecialToTop(data) {
  return request('/admin/specialGoodsManagement/topRecommend', {
    method: 'POST',
    data,
  });
}

//取消置顶
export function fetchSpecialCancleToTop(data) {
  return request('/admin/specialGoodsManagement/cancelTopRecommend', {
    method: 'POST',
    data,
  });
}

//资源位条件配置 /admin/dictionaryAdmin/updateDictionaryAdmin
export function fetchSpecialConditConfig(data) {
  return request('/admin/dictionaryAdmin/updateDictionaryAdmin', {
    method: 'POST',
    data,
  });
}

//运营后台-特惠商品高佣联盟字典值 || 运营后台-特惠商品今日上新字典值
export function fetchResourceDicts(params) {
  return request('/admin/dictionaryAdmin/getDictionaryAdmin', {
    params,
  });
}

// 周边特惠 end

//特惠审核

//审核列表
export function fetchSpecialGoodsCheckList(params) {
  return request('/admin/marketing/audit/listSpecialGoodsAudit', {
    params,
  });
}

//特惠审核详情
export function fetchSpecialGoodsAuditDetail(params) {
  return request('/admin/marketing/audit/getAuditDetail', {
    params,
  });
}

//特惠审核
export function fetchSpecialGoodsAudit(data) {
  return request('/admin/marketing/audit/verifyAudit', {
    method: 'POST',
    data,
  });
}

//特惠审核拒绝
export function fetchSpecialGoodsAuditReject(data) {
  return request('/admin/marketing/audit/rejectAudit', {
    method: 'POST',
    data,
  });
}

// 特惠审核-关闭
export function fetchSpecialGoodsAuditClose(data) {
  return request('/admin/marketing/audit/closeAudit', {
    method: 'POST',
    data,
  });
}

//特惠审核end

// 分享管理

// get 分享管理 - 分享列表
export function fetchShareList(params) {
  return request('/admin/marketingManagement/listMerchantMoment', {
    params,
  });
}

// get 分享管理 - 内容详情
export function fetchShareDetail(params) {
  return request('/admin/marketingManagement/getUserMomentsById', {
    params,
  });
}

// get 分享管理 - 商家平台卡豆信息
export function fetchShareGetPlatformBean(params) {
  return request('/admin/merchant/platformBean', {
    params,
  });
}

// get 分享管理 - 商家账户卡豆信息/推广费
export function fetchShareGetAccountBean(params) {
  return request('/admin/merchantManagement/merchantCredentialsInfo', {
    params,
  });
}

// get 分享管理 - 领豆明细
export function fetchShareGetBeanDetail(params) {
  return request('/admin/marketingManagement/listUserMomentsDetail', {
    params,
  });
}

// post 分享管理 - 下架分享
export function fetchShareStatusClose(data) {
  return request('/admin/marketingManagement/closeUserMoment', {
    method: 'POST',
    data,
  });
}

// post 分享管理 - 审核通过
export function fetchShareVerifyAllow(data) {
  return request('/admin/marketingManagement/simpleVerifyMoment', {
    method: 'POST',
    data,
  });
}

// post 分享管理 - 发布分享
export function fetchShareVideoPush(data) {
  return request('/admin/marketingManagement/publishMerchantMoment', {
    method: 'POST',
    data,
  });
}

// post 分享管理 - 设置假数据 分享收藏数
export function fetchShareLikeSet(params) {
  return request('/admin/marketingManagement/modifyMomentParam', {
    params,
  });
}

// 视频管理新增打赏人数
export function fetchShareRewardPeo(data) {
  return request('/admin/marketingManagement/addBeanPersonAmount', {
    method: 'POST',
    data,
  });
}

// 分享管理 end

// 种草管理

// get 种草管理 - 列表
export function fetchExpertRemdList(params) {
  return request('/admin/kolMoments/listKolMomentsManagement', {
    params,
  });
}

// get 种草管理 - 统计举报数量
export function fetchExpertCountReport(params) {
  return request('/admin/userReport/countPendingUserReport', {
    params,
  });
}

// get 种草管理 - 详情
export function fetchExpertRemdDetail(params) {
  return request('/admin/kolMoments/kolMomentsDetail', {
    params,
  });
}

// post 种草管理 - 上下架
export function fetchExpertRemdStatus(data) {
  return request('/admin/kolMoments/kolMomentsDropOff', {
    method: 'POST',
    data,
  });
}

// get 种草管理 - 举报列表
export function fetchExpertReportList(params) {
  return request('/admin/userReport/listUserReport', {
    params,
  });
}

// post 种草管理 - 举报列表 - 处理举报
export function fetchExpertProcessReport(data) {
  return request('/admin/userReport/processUserReport', {
    method: 'POST',
    data,
  });
}

// 种草管理 end

// 订单列表

// get 订单列表 - 列表
export function fetchOrdersList(params) {
  return request('/admin/orderManagement/listOrder', {
    params,
  });
}

// get 订单列表 - 导出
export function fetchOrdersImport(params) {
  return request('/admin/orderManagement/listOrderImport', {
    params,
  });
}

// get 订单列表 / 退款管理 - 详情
export function fetchOrdersDetail(params) {
  return request('/admin/orderManagement/getOrderById', {
    params,
  });
}

// 订单列表 end

// 核销列表
export function fetchVerificationList(params) {
  return request('/admin/orderGoodsVerification/listOrderGoodsVerification', {
    params,
  });
}

// 退款管理

// get 退款管理 - 列表
export function fetchRefundOrderList(params) {
  return request('/admin/orderManagement/listRefundOrder', {
    params,
  });
}

// 退款管理 end

// 商品管理

// get 商品管理 - 列表
export function fetchGoodsList(params) {
  return request('/admin/goodsManagement/listGoodsManagement', {
    params,
  });
}

// get 商品管理 - 搜索商家
export function fetchGoodsGetMre(params) {
  return request('/user/userMerchant/listMerchantBySearchConditions', {
    params,
  });
}

// get 商品管理 - 商品详情
export function fetchGoodsGetDetail(params) {
  return request('/admin/goodsManagement/getGoodsById', {
    params,
  });
}

// get 商品管理 - 搜索类别
export function fetchGoodsGetClassify(params) {
  return request('/admin/categoryCustomManagement/listCategoryCustomByMerchantId', {
    params,
  });
}

// post 商品管理 - 更新库存
export function fetchUpdataStock(data) {
  return request('/admin/goodsManagement/updateGoodsStockManagement', {
    method: 'POST',
    data,
  });
}

// post 商品管理 - 上架
export function fetchGoodsUp(data) {
  return request('/admin/goodsManagement/onShelfGoods', {
    method: 'POST',
    data,
  });
}

// post 商品管理 - 下架
export function fetchGoodsDown(data) {
  return request('/admin/goodsManagement/offShelfGoods', {
    method: 'POST',
    data,
  });
}

// post 商品管理 - 新增
export function fetchGoodsAdd(data) {
  return request('/admin/goodsManagement/createGoods', {
    method: 'POST',
    data,
  });
}

// post 商品管理 - 删除
export function fetchGoodsDel(data) {
  return request('/admin/goodsManagement/deleteGoods', {
    method: 'POST',
    data,
  });
}

// 商品管理 end

// 分类列表

// get 分类列表 - 列表
export function fetchClassifyList(params) {
  return request('/admin/categoryCustomManagement/listCategoryCustom', {
    params,
  });
}

// post 分类列表 - 新增
export function fetchClassifyAdd(data) {
  return request('/admin/categoryCustomManagement/createCategoryCustom', {
    method: 'POST',
    data,
  });
}

// post 分类列表 - 修改
export function fetchClassifyEdit(data) {
  return request('/admin/categoryCustomManagement/editCategoryCustom', {
    method: 'POST',
    data,
  });
}

// post 分类列表 - 删除
export function fetchClassifyDel(data) {
  return request('/admin/categoryCustomManagement/removeCategoryCustom', {
    method: 'POST',
    data,
  });
}

// 分类列表 end

// 标签管理

// get 标签管理 - 列表
export function fetchTagList(params) {
  return request('/admin/systemConfig/listConfigMerchantTagAdmin', {
    params,
  });
}

// post 标签管理 - 新增
export function fetchTagAdd(data) {
  return request('/admin/systemConfig/saveConfigMerchantTag', {
    method: 'POST',
    data,
  });
}

// post 标签管理 - 修改
export function fetchTagEdit(data) {
  return request('/admin/systemConfig/updateConfigMerchantTag', {
    method: 'POST',
    data,
  });
}

//店铺标签end

//商品标签start

//商品标签列表
export function fetchGoodsTagList(params) {
  return request('/admin/goodsTag/listConfigGoodsTag', {
    params,
  });
}

//运营后台-新增商品标签
export function fetchGoodsTagAdd(data) {
  return request('/admin/goodsTag/saveConfigGoodsTag', {
    method: 'POST',
    data,
  });
}

//编辑
export function fetchGoodsTagUpdate(data) {
  return request('/admin/goodsTag/updateConfigGoodsTag', {
    method: 'POST',
    data,
  });
}

//运营后台-商品标签排序
export function fetchGoodsTagSort(data) {
  return request('/admin/goodsTag/sortConfigGoodsTag', {
    method: 'POST',
    data,
  });
}

// 运营后台-启用/禁用商品标签
export function fetchGoodsTagSwitchStatus(data) {
  return request('/admin/goodsTag/enableConfigGoodsTag', {
    method: 'POST',
    data,
  });
}

// 分类列表 end

// 优惠券管理

// get 优惠券管理 - 列表
export function fetchCouponList(params) {
  return request('/admin/coupon/listOwnerCouponToAction', {
    params,
  });
}

// get 优惠券管理 - 详情
export function fetchCouponDetail(params) {
  return request('/admin/coupon/getOwnerCouponDetail', {
    params,
  });
}

// post 优惠券管理 - 新增
export function fetchCouponSave(data) {
  return request('/admin/coupon/createOwnerCoupon', {
    method: 'POST',
    data,
  });
}

//券修改
export function fetchCouponUpdate(data) {
  return request('/admin/coupon/updateOwnerCoupon', {
    method: 'POST',
    data,
  });
}

// 券下架
export function fetchCouponOff(data) {
  return request('/admin/coupon/offOwnerCoupon', {
    method: 'POST',
    data,
  });
}
// 券删除
export function fetchCouponDelete(data) {
  return request('/admin/coupon/deleteOwnerCoupon', {
    method: 'POST',
    data,
  });
}

// get 优惠券导出
export function fetchCouponToImport(params) {
  return request('/admin/coupon/listOwnerCouponToActionImport', {
    params,
  });
}

//券审核-列表
export function fetchCouponAuditList(params) {
  return request('/admin/marketing/audit/listReduceCouponAudit', {
    params,
  });
}
// 券审核详情
export function fetchCouponAuditDetail(params) {
  return request('/admin/marketing/audit/getAuditDetailCoupon', {
    params,
  });
}

// 优惠券管理 end
