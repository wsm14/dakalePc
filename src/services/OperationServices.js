import request from '@/utils/request';

//平台权益

// post 平台权益 - 赠送霸王餐
export function fetchGiveGoods(data) {
  return request('/admin/coupon/saveFreeUserCoupon', {
    method: 'POST',
    data,
  });
}

//平台权益end

// 周边特惠

// get 周边特惠 - 列表
export function fetchSpecialGoodsList(params) {
  return request('/admin/offline/goods/admin/listOfflineGoodsByPage', {
    params,
  });
}

// get 周边特惠 - 详情
export function fetchSpecialGoodsDetail(params) {
  return request('/admin/offline/goods/admin/getGoodsForUpdate', {
    params,
  });
}
// get 周边特惠 - 分享图详情
export function fetchSpecialGoodsShareDetail(params) {
  return request('/admin/offline/goods/admin/getOfflineShareInfo', {
    params,
  });
}

// get 周边特惠 - 查询店铺主体当前的费率
export function fetchCheckMreRate(params) {
  return request('/admin/owner/rate/getOwnerEffectiveRate', {
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
  return request('/admin/offline/goods/admin/offShelfOffline', {
    method: 'POST',
    data,
  });
}

// post 周边特惠 - 删除
export function fetchSpecialGoodsDelete(data) {
  return request('/admin/offline/goods/admin/deleteOffline', {
    method: 'POST',
    data,
  });
}

// post 周边特惠 - 分享图修改
export function fetchSpecialGoodsShareEdit(data) {
  return request('/admin/offline/goods/admin/updateOfflineShareInfo', {
    method: 'POST',
    data,
  });
}

// post 周边特惠 - 编辑
export function fetchSpecialGoodsEdit(data) {
  return request('/admin/offline/goods/admin/updateOfflineGoods', {
    method: 'POST',
    data,
  });
}

// post 周边特惠 - 新增
export function fetchSpecialGoodsSave(data) {
  return request('/admin/offline/goods/admin/saveOfflineGoods', {
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

// 特惠增加库存
export function fetchSpecialGoodsAddRemain(data) {
  return request('/admin/stock/admin/addStock', {
    method: 'POST',
    data,
  });
}

// 取消置顶
export function fetchSpecialCancleToTop(data) {
  return request('/admin/specialGoodsManagement/cancelTopRecommend', {
    method: 'POST',
    data,
  });
}

// 资源位条件配置 /admin/dictionaryAdmin/updateDictionaryAdmin
export function fetchSpecialConditConfig(data) {
  return request('/admin/dictionaryAdmin/updateDictionaryAdmin', {
    method: 'POST',
    data,
  });
}

// 运营后台-特惠商品高佣联盟字典值 || 运营后台-特惠商品今日上新字典值
export function fetchResourceDicts(params) {
  return request('/admin/dictionaryAdmin/getDictionaryAdmin', {
    params,
  });
}

// 资源位权重
export function fetchSetTopRecommendWeight(data) {
  return request('/admin/specialGoodsManagement/setTopRecommendWeight', {
    method: 'POST',
    data,
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

// post 视频管理 - 新增打赏人数
export function fetchShareRewardPeo(data) {
  return request('/admin/marketingManagement/addBeanPersonAmount', {
    method: 'POST',
    data,
  });
}

// post 视频管理 - 视频权重设置
export function fetchShareWeightSet(data) {
  return request('/admin/marketingManagement/modifyRecommendWeight', {
    method: 'POST',
    data,
  });
}

// 分享管理 end

// 平台视频  分为 -商家视频-UGC视频

// get 平台视频 - 列表
export function fetchNewShareList(params) {
  return request('/admin/marketing/moment/new/listMoment', {
    params,
  });
}

// get 平台视频 - 查询视频统计信息
export function fetchNewShareStatisticsList(params) {
  return request('/admin/marketing/moment/new/momentStatisticParamById', {
    params,
  });
}

// get 平台视频 - 内容详情
// get UGC视频 - UGC视频详情展示定位
export function fetchNewShareDetail(params) {
  return request('/admin/marketing/moment/new/momentDetail', {
    params,
  });
}

// get 平台视频 - 打赏设置
export function fetchNewShareRewardSet(params) {
  return request('/admin/marketing/moment/tipping/momentTippingList', {
    params,
  });
}

// get 平台视频 - 设置-分享数，收藏数，打赏卡豆数-列表
export function fetchVideoFakeList(params) {
  return request('/admin/configMomentSimulation/listConfigMomentSimulation', {
    params,
  });
}

// post 平台视频 - 设置-分享数，收藏数，打赏卡豆数-配置
export function fetchVideoFakeListAdd(data) {
  return request('/admin/configMomentSimulation/setMomentSimulationConfig', {
    method: 'POST',
    data,
  });
}

// post 平台视频 - 设置-分享数，收藏数，打赏卡豆数-编辑
export function fetchVideoFakeListEdit(data) {
  return request('/admin/configMomentSimulation/updateMomentSimulationConfig', {
    method: 'POST',
    data,
  });
}

// post 平台视频 - 修改视频（审核）
export function fetchNewShareAuditEdit(data) {
  return request('/admin/marketing/moment/new/updateMoment', {
    method: 'POST',
    data,
  });
}

// post 平台视频 - 修改视频（不审核）
// post 商家/UGC视频 - 商家、UGC视频设置收藏分享数
export function fetchNewShareNoAudit(data) {
  return request('/admin/marketing/moment/new/updateMomentDirect', {
    method: 'POST',
    data,
  });
}

// post 平台视频 - 发布分享
export function fetchNewSharePush(data) {
  return request('/admin/marketing/moment/new/publishMoment', {
    method: 'POST',
    data,
  });
}

// post 平台视频 - 下架分享
export function fetchNewShareClose(data) {
  return request('/admin/marketing/moment/new/offMoment', {
    method: 'POST',
    data,
  });
}

// post 平台视频 - 删除分享
export function fetchNewShareDel(data) {
  return request('/admin/marketing/moment/new/deleteMoment', {
    method: 'POST',
    data,
  });
}

// post 平台视频 - 创建打赏
export function fetchNewShareRewardSave(data) {
  return request('/admin/marketing/moment/tipping/createMomentTipping', {
    method: 'POST',
    data,
  });
}

// post 平台视频 - 取消打赏
export function fetchNewShareRewardCancel(data) {
  return request('/admin/marketing/moment/tipping/cancelTipping', {
    method: 'POST',
    data,
  });
}

// get UGC视频 - 读取UGC视频平台奖励卡豆规则/读取UGC视频打赏规则
export function fetchUGCVideoBeanRules(params) {
  return request('/admin/dictionaryAdmin/getDictionaryAdmin', {
    params,
  });
}

// post UGC视频 - UGC视频平台奖励卡豆规则设置
export function fetchUGCVideoBeanRulesSet(data) {
  return request('/admin/marketing/moment/new/setUGCMomentPlatformRewardBeanRule', {
    method: 'POST',
    data,
  });
}

// post UGC视频 - UGC视频打赏规则设置
export function fetchUGCVideoRulesSet(data) {
  return request('/admin/marketing/moment/new/setUGCMomentRewardRule', {
    method: 'POST',
    data,
  });
}

// get 商家/UGC视频 - 获取商家、UGC视频列表
export function fetchUGCVideoList(params) {
  return request('/admin/marketing/moment/new/listMoment', {
    params,
  });
}

// get UGC视频 - 获取UGC视频打赏明细
export function fetchUGCVideoRewardInfo(params) {
  return request('/admin/marketing/moment/new/listUserRewardRecord', {
    params,
  });
}

// 平台视频 end

// 订单列表

// get 订单列表 - 列表
export function fetchOrdersList(params) {
  return request('/admin/orderManagement/listOrder', {
    params,
  });
}

// get 订单列表 - 导出
export function fetchOrdersImport(params) {
  return request('/admin/orderManagement/listOrderExport', {
    params,
  });
}

// get 订单列表 / 退款管理 - 详情
export function fetchOrdersDetail(params) {
  return request('/admin/orderManagement/getOrderById', {
    params,
  });
}

// post 订单列表 - 手动退款
export function fetchOrderRefundOwn(data) {
  return request('/admin/orderManagement/manualRefund', {
    method: 'POST',
    data,
  });
}

// post 订单列表 - 批量分账
export function fetchBatchSplitAccount(data) {
  return request('/admin/orderManagement/batchSplitAccount', {
    method: 'POST',
    data,
  });
}

// post 电商订单-发货
export function fetchOrderDeliverGoods(data) {
  return request('/admin/orderManagement/deliverGoods', {
    method: 'POST',
    data,
  });
}

// get 电商订单-日志
export function fetchOrdersListActionLog(params) {
  return request('/admin/actionLog/listActionLog', {
    params,
  });
}

// get 订单列表 - 列表(新)
export function fetchPageListOrdersList(params) {
  return request('/admin/order/order/pageListOrder', {
    params,
  });
}

// get 订单列表 - 详情（新）
export function fetchGetOrderDetail(params) {
  return request('/admin/order/order/getOrderForAdmin', {
    params,
  });
}

// post 电商订单-发货(新)
export function fetchDeliverGoods(data) {
  return request('/admin/order/order/deliverGoods', {
    method: 'POST',
    data,
  });
}

// post 订单列表 - 手动退款（新）
export function fetchOrderImmediateRefund(data) {
  return request('/admin/order/order/orderImmediateRefund', {
    method: 'POST',
    data,
  });
}

// post 订单列表 - 分账(新)
export function fetchSubLedger(data) {
  return request('/admin/order/order/subLedger', {
    method: 'POST',
    data,
  });
}

// get 订单列表(新) - 导出（暂时）
export function fetchExportUndeliveredCommerceGoodsOrderList(params) {
  return request('/admin/order/order/exportUndeliveredCommerceGoodsOrderList', {
    params,
  });
}

// 订单列表 end

//退款列表

//退款列表 -list
export function fetchRefundPageOrderList(params) {
  return request('/admin/order/refund/apply/pageListOrderRefundApply', {
    params,
  });
}

// post 退款列表 - 同意
export function fetchRefundApply(data) {
  return request('/admin/order/refund/apply/batchConsent', {
    method: 'POST',
    data,
  });
}

// post 退款列表 - 拒绝
export function fetchRefundRefuse(data) {
  return request('/admin/order/refund/apply/refuse', {
    method: 'POST',
    data,
  });
}

// post 退款列表 - 备注
export function fetchRefundRemark(data) {
  return request('/admin/order/refund/apply/remarkOrderRefundApply', {
    method: 'POST',
    data,
  });
}

//退款列表/退款管理  -- 详情
export function fetchRefundRrderDetail(params) {
  return request('/admin/order/order/getOrderForAdmin', {
    params,
  });
}

//退款列表 --end

// 核销列表
export function fetchVerificationList(params) {
  return request('/admin/orderGoodsVerification/listOrderGoodsVerification', {
    params,
  });
}

// 退款管理

// get 退款管理 - 列表
export function fetchRefundOrderList(params) {
  return request('/admin/order/refund/pageListOrderRefund', {
    params,
  });
}
// post 退款管理 - 立即退款
export function fetchRefundPayBack(data) {
  return request('/admin/order/refund/immediateRefund', {
    method: 'POST',
    data,
  });
}

// post 退款管理 - 备注
export function fetchRefundOrderRemark(data) {
  return request('/admin/order/refund/remarkOrderRefund', {
    method: 'POST',
    data,
  });
}

// post 退款管理 - 查询快递物流信息
export function fetchGetExpressInfo(params) {
  return request('/common/express/getExpressInfo', {
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

// 优惠券管理

// post 优惠券管理 - 分享配置
export function fetchCouponManageShareEdit(data) {
  return request('/admin/coupon/updateOwnerCouponNotAudit', {
    method: 'POST',
    data,
  });
}

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
  return request('/admin/coupon/listOwnerCouponToActionExport', {
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

// 券增加库存
export function fetchCouponAddRemain(data) {
  return request('/admin/coupon/addGoodsRemain', {
    method: 'POST',
    data,
  });
}

// get 优惠券管理 - 免费券 - 领取核销记录 - 列表
export function fetchListFreeReduceCouponReceiveVerificationRecord(params) {
  return request('/admin/coupon/listFreeReduceCouponReceiveVerificationRecord', {
    params,
  });
}

// * 特惠或券编辑前校验
export function fetchEditCurrentStatus(params) {
  return request('/admin/specialGoodsManagement/judgeCurrentAuditStatus', {
    params,
  });
}

// 优惠券管理 end

// 视频审核

// 视频审核 - 列表
export function fetchListMomentAudit(params) {
  return request('/admin/marketing/audit/listMomentAudit', {
    params,
  });
}
// 视频审核详情
export function fetchAuditMomentDetail(params) {
  return request('/admin/marketing/audit/getAuditMomentDetail', {
    params,
  });
}

// 视频审核 end

// 平台券

// get 平台券 - 分页列表
export function fetchPagePlatformCoupon(params) {
  return request('/admin/platform/coupon/pagePlatformCoupon', {
    params,
  });
}

// get 平台券 - 详情
export function fetchGetPlatformCouponDetail(params) {
  return request('/admin/platform/coupon/getPlatformCouponDetail', {
    params,
  });
}

// post 平台券 - 创建平台券 - 新增
export function fetchPlatformCouponSave(data) {
  return request('/admin/platform/coupon/createPlatformCoupon', {
    method: 'POST',
    data,
  });
}

// post 平台券 - 创建平台券 - 编辑
export function fetchPlatformCouponUpdate(data) {
  return request('/admin/platform/coupon/updatePlatformCoupon', {
    method: 'POST',
    data,
  });
}

// post 平台券 - 下架
export function fetchPlatformCouponOff(data) {
  return request('/admin/platform/coupon/offShelfPlatformCoupon', {
    method: 'POST',
    data,
  });
}

// post 平台券 - 上架
export function fetchPlatformCouponOn(data) {
  return request('/admin/platform/coupon/onShelfPlatformCoupon', {
    method: 'POST',
    data,
  });
}

// post 平台券 - 增加库存
export function fetchAddTotalPlatformCoupon(data) {
  return request('/admin/platform/coupon/addTotalPlatformCoupon', {
    method: 'POST',
    data,
  });
}

// post 平台券 - 赠送
export function fetchGivePlatformCoupon(data) {
  return request('/admin/platform/coupon/givePlatformCoupon', {
    method: 'POST',
    data,
  });
}

// get 平台券 - 导入记录列表
export function fetchPagePlatformCouponGiveImport(params) {
  return request('/admin/platform/coupon/pagePlatformCouponGiveImport', {
    params,
  });
}

// get 平台券 - 导入记录列表明细
export function fetchPagePlatformCouponGiveImportDetail(params) {
  return request('/admin/platform/coupon/pagePlatformCouponGiveImportDetail', {
    params,
  });
}

// 平台券 end

// 礼包管理

// get 礼包管理 - 礼包类型 - 列表 - 不分页
export function fetchListGiftType(params) {
  return request('/admin/gift/type/listGiftType', {
    params,
  });
}

// post 礼包管理 - 礼包类型 - 新增
export function fetchCreateGiftType(data) {
  return request('/admin/gift/type/createGiftType', {
    method: 'POST',
    data,
  });
}

// post 礼包管理 - 礼包类型 - 修改
export function fetchUpdateGiftType(data) {
  return request('/admin/gift/type/updateGiftType', {
    method: 'POST',
    data,
  });
}

// get 礼包管理 - 礼包类型 - 详情
export function fetchGetGiftTypeById(params) {
  return request('/admin/gift/type/getGiftTypeById', {
    params,
  });
}

// post 礼包管理 - 礼包 - 新增
export function fetchCreatePlatformGiftPack(data) {
  return request('/admin/platform/gift/pack/createPlatformGiftPack', {
    method: 'POST',
    data,
  });
}

// post 礼包管理 - 礼包 - 编辑
export function fetchUpdatePlatformGiftPack(data) {
  return request('/admin/platform/gift/pack/updatePlatformGiftPack', {
    method: 'POST',
    data,
  });
}

// get 礼包管理 - 礼包 - 列表
export function fetchPagePlatformGiftPack(params) {
  return request('/admin/platform/gift/pack/pagePlatformGiftPack', {
    params,
  });
}

// get 礼包管理 - 礼包 - 详情
export function fetchGetPlatformGiftPackDetail(params) {
  return request('/admin/platform/gift/pack/getPlatformGiftPackDetail', {
    params,
  });
}

// post 礼包管理 - 礼包 - 下架
export function fetchShelfPlatformGiftPackOff(data) {
  return request('/admin/platform/gift/pack/offShelfPlatformGiftPack', {
    method: 'POST',
    data,
  });
}

// post 礼包管理 - 礼包 - 上架
export function fetchShelfPlatformGiftPackOn(data) {
  return request('/admin/platform/gift/pack/onShelfPlatformGiftPack', {
    method: 'POST',
    data,
  });
}

// post 礼包管理 - 礼包 - 增加库存
export function fetchAddTotalPlatformGiftPack(data) {
  return request('/admin/platform/gift/pack/addTotalPlatformGiftPack', {
    method: 'POST',
    data,
  });
}

// get 礼包管理 - 礼包 - 领取明细
export function fetchListUserGiftReceiveByPage(params) {
  return request('/admin/platform/gift/pack/listUserGiftReceiveByPage', {
    params,
  });
}

// get 礼包管理 - 礼包 - 领取明细 - 用户券明细
export function fetchListUserCouponByGift(params) {
  return request('/admin/platform/gift/pack/listUserCouponByGift', {
    params,
  });
}

// 礼包管理 end

// 券规则管理

// get 券规则管理 - 行业设置 - 列表
export function fetchConponListCategory(params) {
  return request('/admin/systemIndustry/listCategory', {
    params,
  });
}

// get 券规则管理 - 店铺数据 - 店铺列表
export function fetchConponListMerchant(params) {
  return request('/admin/merchantManagement/listMerchant', {
    params,
  });
}

// get 券规则管理 - 集团列表 - 列表
export function fetchConponListMerchantGroup(params) {
  return request('/admin/merchantGroup/listMerchantGroup', {
    params,
  });
}

// get 券规则管理 - 特惠商品 - 列表
export function fetchListSpecialGoodsManagement(params) {
  return request('/admin/specialGoodsManagement/listSpecialGoodsManagement', {
    params,
  });
}

// post 券规则管理 - 新增
export function fetchCreateRule(data) {
  return request('/admin/couponRule/createRule', {
    method: 'POST',
    data,
  });
}

// get 券规则管理 - 列表
export function fetchListRuleByPage(params) {
  return request('/admin/couponRule/listRuleByPage', {
    params,
  });
}

// post 券规则管理 - 启用停用规则
export function fetchUpdateRuleStatus(data) {
  return request('/admin/couponRule/updateRuleStatus', {
    method: 'POST',
    data,
  });
}

// get 券规则管理 - 详情 - 获取带有全部id的详情接口
export function fetchRuleDetail(params) {
  return request('/admin/couponRule/ruleDetail', {
    params,
  });
}

// get 券规则管理 - 详情 - 获取具体数据对象的详情接口
export function fetchRuleDetailPage(params) {
  return request('/admin/couponRule/ruleDetailPage', {
    params,
  });
}

// 券规则管理 end

// 电商品

// get 电商品 - 列表
export function fetchListOnlineGoodsByPage(params) {
  return request('/admin/online/goods/admin/listOnlineGoodsByPage', {
    params,
  });
}

// post 电商品 - 新增
export function fetchSaveOnlineGoods(data) {
  return request('/admin/online/goods/admin/saveOnlineGoods', {
    method: 'POST',
    data,
  });
}

// post 电商品 - 详情
export function fetchGetGoodsForUpdate(params) {
  return request('/admin/online/goods/admin/getGoodsForUpdate', {
    params,
  });
}

// post 电商品 - 修改
export function fetchUpdateOnlineGoods(data) {
  return request('/admin/online/goods/admin/updateOnlineGoods', {
    method: 'POST',
    data,
  });
}

// post 电商品 - 下架
export function fetchOffShelfOffline(data) {
  return request('/admin/online/goods/admin/offShelfOffline', {
    method: 'POST',
    data,
  });
}

// post 电商品 - 修改库存
export function fetchAddStock(data) {
  return request('/admin/stock/admin/addStock', {
    method: 'POST',
    data,
  });
}

// get 电商品 - sku列表
export function fetchListSkuStockByServiceId(params) {
  return request('/admin/sku/admin/listSkuStockByServiceId', {
    params,
  });
}

// get 电商品 - 获取分享配置详情
export function fetchGetOnlineShareInfo(params) {
  return request('/admin/online/goods/admin/getOnlineShareInfo', {
    params,
  });
}

// post 电商品 - 分享配置修改
export function fetchUpdateOnlineShareInfo(data) {
  return request('/admin/online/goods/admin/updateOnlineShareInfo', {
    method: 'POST',
    data,
  });
}

// 电商品 end
