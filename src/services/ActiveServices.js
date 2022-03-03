import request from '@/utils/request';

// get 获取oss凭证 - 上传网页
export async function fetchGetOss(params) {
  return request('/common/oss/getOssPolicy', {
    params,
  });
}

// get 获取特惠商品选择列表
export async function fetchSpecialGoodsSelect(params) {
  return request('/admin/specialGoodsManagement/listSpecialGoodsForActivityTemp', {
    params,
  });
}

// get 获取电商商品选择列表
export function fetchCommerceGoodsSelect(params) {
  return request('/admin/specialGoodsManagement/listSpecialGoodsManagement', {
    params,
  });
}

// get 获取优惠券选择列表
export async function fetchCouponSelect(params) {
  return request('/admin/coupon/listCouponForActivityTemp', {
    params,
  });
}

// get 获取平台券选择列表
export function fetchPlatformCouponSelect(params) {
  return request('/admin/platform/coupon/pagePlatformCoupon', {
    params,
  });
}

// get 获取商家详细数量 - 券/打卡豆数/券数量
export async function fetchGetMreConfigInfo(params) {
  return request('/admin/merchantManagement/getSomeInfoByOwnerId', {
    params,
  });
}

// post 活动列表 - 新增
export function fetchActiveAdd(data) {
  return request('/admin/activityTemplate/saveActivityTemplate', {
    method: 'POST',
    data,
  });
}

// post 活动配置 - 修改
export function fetchActiveEdit(data) {
  return request('/admin/activityTemplate/updateActivityTemplate', {
    method: 'POST',
    data,
  });
}

// get 活动列表 - 列表
export async function fetchActiveList(params) {
  return request('/admin/activityTemplate/listActivityTemplate', {
    params,
  });
}

// get 活动列表 - 详情
export async function fetchActiveDetail(params) {
  return request('/admin/activityTemplate/getActivityTemplateById', {
    params,
  });
}

// get 助力列表 - 列表
export async function fetchAssistanceList(params) {
  return request('/admin/config/blindBox/listUserBlindBoxHelp', {
    params,
  });
}

// get 助力列表 - 详情
export async function fetchAssistanceDetail(params) {
  return request('/admin/config/blindBox/boostDetails', {
    params,
  });
}

// 营销物料配置

// get 营销物料配置 - 列表
export async function fetchMaterialConfigList(params) {
  return request('/admin/matterConfig/listMatterConfig', {
    params,
  });
}

// post 营销物料配置 - 获取用户二维码
export function fetchMaterialConfigUserCode(data) {
  return request('/admin/matterConfig/getUserMiniProgramQCode', {
    method: 'POST',
    data,
  });
}

// post 营销物料配置 - 保存
export function fetchMaterialConfigSave(data) {
  return request('/admin/matterConfig/saveMatterConfig', {
    method: 'POST',
    data,
  });
}

// 营销物料配置 end

// 盲盒抽奖配置

// get 盲盒奖池列表 - 列表
export async function fetchBlindBoxList(params) {
  return request('/admin/luckDraw/getAllPrizePool', {
    params,
  });
}

// post 盲盒奖池 - 添加
export function fetchAddPrizePool(data) {
  return request('/admin/luckDraw/addPrizePool', {
    method: 'POST',
    data,
  });
}

// post 盲盒奖池 - 修改
export function fetchUpdatePrizePool(data) {
  return request('/admin/luckDraw/updatePrizePool', {
    method: 'POST',
    data,
  });
}

// post 盲盒奖池 - 删除
export function fetchDeletePrizePool(data) {
  return request('/admin/luckDraw/deletePrizePool', {
    method: 'POST',
    data,
  });
}

// get 盲盒抽奖配置 - 列表
export async function fetchGetLuckDrawPool(params) {
  return request('/admin/luckDraw/getLuckDrawPool', {
    params,
  });
}

// post 盲盒抽奖配置 - 设置
export function fetchSetLuckDrawConfig(data) {
  // /admin/luckDraw/setLuckDrawConfig
  return request('/admin/luckDraw/setLuckDrawConfig', {
    method: 'POST',
    data,
  });
}

// 盲盒抽奖配置 end

// get 盲盒中奖记录 - 列表
export function fetchBoxLotteryList(params) {
  return request('/admin/config/blindBox/listUserBlindBoxReward', {
    params,
  });
}

// get 盲盒中奖记录 - 列表导出
export function fetchBoxLotteryExport(params) {
  return request('/admin/config/blindBox/listUserBlindBoxRewardExport', {
    params,
  });
}

// get 盲盒中奖记录 - 查看物流
export function fetchBoxDetail(params) {
  return request('/admin/config/blindBox/viewLogistics', {
    params,
  });
}

// get 盲盒中奖记录 - 发货
export function fetchBoxAddAndPush(data) {
  return request('/admin/config/blindBox/deliverGoods', {
    method: 'POST',
    data,
  });
}

// get 盲盒中奖记录 - 签到游戏/免费领商品(电商品) - 列表
export function fetchListUserPackageManagement(params) {
  return request('/admin/package/listUserPackageManagement', {
    params,
  });
}

// get 盲盒中奖记录 - 签到游戏/免费领商品(电商品) - 列表导出
export function fetchListUserPackageManagementExport(params) {
  return request('/admin/package/listUserPackageManagementExport', {
    params,
  });
}

// get 盲盒中奖记录 - 签到游戏/免费领商品(卡豆权益品) - 列表
export function fetchListUserPackageManagementBean(params) {
  return request('/admin/gameRecord/listGameRecordManagement', {
    params,
  });
}

// get 盲盒中奖记录 - 签到游戏/免费领商品(卡豆权益品) - 列表导出
export function fetchListUserPackageManagementBeanExport(params) {
  return request('/admin/gameRecord/listGameRecordManagementExport', {
    params,
  });
}

// get 盲盒中奖记录 - 签到游戏 - 查看物流
export function fetchGetUserPackageById(params) {
  return request('/admin/package/getUserPackageById', {
    params,
  });
}

// post 盲盒中奖记录 - 签到游戏 - 发货
export function fetchDeliveryUserPackage(data) {
  return request('/admin/package/deliveryUserPackage', {
    method: 'POST',
    data,
  });
}
