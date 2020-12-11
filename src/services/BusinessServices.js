import request from '@/utils/request';

// 店铺数据

// get 商户数据 - 商户列表
export function fetchMerchantList(params) {
  return request('/admin/merchantManagement/listMerchant', {
    params,
  });
}

// get 商户数据 - 商户列表
export function fetchMerchantExportExcel(params) {
  return request('/admin/merchantManagement/listMerchantImport', {
    params,
  });
}

// get 商户数据 - 统计数据 总商家/流失/活跃
export function fetchMerchantTotal() {
  return request('/admin/merchantManagement/getMerchantStatistic');
}

// get 商户数据 - 统计数据 新入驻/家主/家店/行业
export function fetchMerchantTotalCategory(params) {
  return request('/admin/merchantManagement/getMerchantStatisticByDate', {
    params,
  });
}

// get 商户数据 - 商户详情
export function fetchMerchantDetail(params) {
  return request('/admin/merchantManagement/merchantCredentialsInfo', {
    params,
  });
}

// post 商户数据 - 商家 设置开户行号
export function fetchMerSetBandCode(data) {
  return request('/admin/merchantManagement/updateMerchantBankSwiftCode', {
    method: 'POST',
    data,
  });
}

// post 商户数据 - 商家新增
export function fetchMerchantAdd(data) {
  return request('/admin/userMerchantVerify/saveUserMerchantVerify', {
    method: 'POST',
    data,
  });
}

// post 商户数据 - 商家 修改
export function fetchMerchantEdit(data) {
  return request('/admin/merchantManagement/editMerchant', {
    method: 'POST',
    data,
  });
}

// post 商户数据 - 商家 设置
export function fetchMerchantSet(data) {
  return request('/admin/merchantManagement/updateMerchantBeanSet', {
    method: 'POST',
    data,
  });
}

// post 商户数据 - 商家 店铺状态 经营状态 修改
export function fetchMerchantStatus(data) {
  return request('/admin/merchantManagement/updateUserMerchant', {
    method: 'POST',
    data,
  });
}

// post 商户数据 - 设置商家端验证码
export function fetchMerVerificationCodeSet(data) {
  return request('/admin/merchantManagement/setMerchantLogonCode', {
    method: 'POST',
    data,
  });
}

// 店铺数据 end

// 审核列表

// get 商户审核 - 商户审核列表
export function fetchMerchantAuditList(params) {
  return request('/admin/merchantManagement/listMerchantVerify', {
    params,
  });
}

// get 商户审核 - 商户审核详情列表
export function fetchMerchantAuditDetailList(params) {
  return request('/admin/userMerchantVerifyRecord/listUserMerchantVerifyRecord', {
    params,
  });
}

// get 商户审核 - 商户审核详情
export function fetchMerchantAuditDetail(params) {
  return request('/admin/merchantManagement/getMerchantVerifyDetail', {
    params,
  });
}

// post 商户审核 - 商家 审核通过
export function fetchMerSaleAuditAllow(data) {
  return request('/admin/userMerchantVerify/updateUserMerchantVerifyStatusInfo', {
    method: 'POST',
    data,
  });
}

// post 商户审核 - 商家 审核拒绝
export function fetchMerSaleAudit(data) {
  return request('/admin/userMerchantVerify/updateUserMerchantVerifyStatusInfo', {
    method: 'POST',
    data,
  });
}

// 审核列表 end

// get 注册列表 - 列表
export function fetchMerRegisterList(params) {
  return request('/admin/merchantManagement/listMerchantUnVerified', {
    params,
  });
}

// 入驻查询

// get 入驻查询 - 列表
export function fetchMerSettledList(params) {
  return request('/admin/merchantManagement/listMerchantSettleIn', {
    params,
  });
}

// get 入驻查询 - 获取excel数据
export function fetchGetMerSettledExcel(params) {
  return request('/admin/merchantManagement/listMerchantSettleIn', {
    params,
  });
}

// 入驻查询 end

// 集团管理

// get 集团列表 - 统计
export function fetchMerchantGroup(params) {
  return request('/admin/merchantGroup/listMerchantGroup', {
    params,
  });
}

// post 集团列表 - 话题设置 删除 修改 推荐
export function fetchAddMerchantGroup(data) {
  return request('/admin/merchantGroup/saveMerchantGroup', {
    method: 'POST',
    data,
  });
}
//新增集团

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

// 集团管理 end

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

// post 商品管理 - 下架
export function fetchGoodsUpdataStatus(data) {
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
