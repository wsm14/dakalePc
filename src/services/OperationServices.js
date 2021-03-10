import request from '@/utils/request';

// 周边特惠

// get 周边特惠 - 列表
export function fetchSpecialGoodsList(params) {
  return request('/admin/specialGoodsManagement/listSpecialGoodsManagement', {
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

// post 周边特惠 - 推荐状态
export function fetchSpecialGoodsRecommend(data) {
  return request('/admin/specialGoodsManagement/setRecommend', {
    method: 'POST',
    data,
  });
}

// 周边特惠 end

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

// post 分享管理 - 下架分享
export function fetchShareStatusClose(data) {
  return request('/admin/marketingManagement/closeUserMoment', {
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
  return request('/user/userReport/countPendingUserReport', {
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
  return request('/user/userReport/listUserReport', {
    params,
  });
}

// post 种草管理 - 举报列表 - 处理举报
export function fetchExpertProcessReport(data) {
  return request('/user/userReport/processUserReport', {
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

// get 订单列表 / 退款管理 - 详情
export function fetchOrdersDetail(params) {
  return request('/admin/orderManagement/getOrderById', {
    params,
  });
}

// 订单列表 end

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
  return request('/common/systemConfig/saveConfigMerchantTag', {
    method: 'POST',
    data,
  });
}

// post 标签管理 - 修改
export function fetchTagEdit(data) {
  return request('/common/systemConfig/updateConfigMerchantTag', {
    method: 'POST',
    data,
  });
}

// 分类列表 end

// 优惠券管理

// get 优惠券管理 - 列表
export function fetchCouponList(params) {
  return request('/admin/systemConfig/listConfigMerchantTagAdmin', {
    params,
  });
}

// post 优惠券管理 - 下架
export function fetchCouponStatus(data) {
  return request('/common/systemConfig/saveConfigMerchantTag', {
    method: 'POST',
    data,
  });
}

// 优惠券管理 end
