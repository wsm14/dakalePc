import request from '@/utils/request';

// get 卡豆乐园 - 挑战赛 - 统计数据
export async function fetchMarketRMTotal(params) {
  return request('/admin/marketingManagement/matchStatistic', {
    params,
  });
}

// get 卡豆乐园 - 挑战赛列表
export async function fetchMarketMatch(params) {
  return request('/admin/marketingManagement/pageUserMatchByDateAndType', {
    params,
  });
}

// get 卡豆乐园 -  挑战赛报名列表
export async function fetchMarketMatchJoin(params) {
  return request('/admin/marketingManagement/listUserMatch', {
    params,
  });
}

// get 卡豆乐园 - 公告列表
export async function fetchMarketNoticeList(params) {
  return request('/admin/marketingManagement/listConfigAnnounce', {
    params,
  });
}

// post 卡豆乐园 - 公告新增
export function fetchMarketNoticeAdd(data) {
  return request('/admin/marketingManagement/saveConfigAnnounce', {
    method: 'POST',
    data,
  });
}

// post 卡豆乐园 - 公告发布 删除 修改
export function fetchMarketNoticeSet(data) {
  return request('/admin/marketingManagement/updateConfigAnnounce', {
    method: 'POST',
    data,
  });
}

// get 营销活动 - 营销活动列表
export async function fetchMarketActivity(params) {
  return request('/admin/marketingActivity/listActivity', {
    params,
  });
}

// get 营销活动 - 活动商家列表
export async function fetchMarketActivityStore(params) {
  return request('/admin/marketCoupon/listMarketCoupon', {
    params,
  });
}

// get 营销活动 - 输入商家名称查找商家
export async function fetchMarketActivityStoreName(params) {
  return request('/admin/marketCoupon/listMerchantName', {
    params,
  });
}

// get 营销活动 - 选择商家 获取标签
export async function fetchStoreGoodsType(params) {
  return request('/admin/marketingActivity/listCategoryByMerchantId', {
    params,
  });
}

// get 营销活动 - 获取优惠券详情
export async function fetchStoreGoodsCouponInfo(params) {
  return request('/admin/marketCoupon/getMarketCouponDeduct', {
    params,
  });
}

// get 营销活动 - 兑换券订单明细
export async function fetchStoreOrderDetail(params) {
  return request('/admin/marketCoupon/listMarketCouponOrder', {
    params,
  });
}

// get 营销活动 - 兑换券核销明细
export async function fetchStoreCouponDestoryDetail(params) {
  return request('/admin/marketCoupon/listUserMarketCoupon', {
    params,
  });
}

// post 营销活动 - 营销活动下架
export function fetchMarketActivityCancel(data) {
  return request('/admin/marketingActivity/updateActivity', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 营销活动新增
export function fetchMarketActivityAdd(data) {
  return request('/admin/marketingActivity/addActivity', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 商家新增
export function fetchMarketActivityStoreSet(data) {
  return request('/admin/marketCoupon/addUserMarketCoupon', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 优惠券新增
export function fetchMarketActivityCouponSet(data) {
  return request('/admin/marketCoupon/addMarketCouponDeduct', {
    method: 'POST',
    data,
  });
}

// post 卡豆乐园 - 早起挑战赛设置
export function fetchMarketMatchMorningSet(data) {
  return request('/admin/marketingManagement/updateMatchWakeUp', {
    method: 'POST',
    data,
  });
}

// post 卡豆乐园 - 步数挑战赛设置
export function fetchMarketMatchRuningSet(data) {
  return request('/admin/marketingManagement/updateMatchWalk', {
    method: 'POST',
    data,
  });
}

// 打卡设置

// get 打卡设置 - 打卡列表
export function fetchCheckInList(params) {
  return request('/admin/healthLife/listUserHealthLife', {
    params,
  });
}

// get 打卡设置 - 图片文案列表
export function fetchCheckInImgTextList(params) {
  return request('/admin/healthLife/listUserHealthListWords', {
    params,
  });
}

// post 打卡设置 - 打卡列表编辑
export function fetchCheckInEdit(data) {
  return request('/admin/healthLife/updateUserHealthLifeStyleMarkTime', {
    method: 'POST',
    data,
  });
}

// post 打卡设置 - 图片 文案编辑
export function fetchCheckInTextImgEdit(data) {
  return request('/admin/healthLife/updateUserHealthLifeStyleContent', {
    method: 'POST',
    data,
  });
}

// post 打卡设置 - 图片 文案新增
export function fetchCheckInTextImgAdd(data) {
  return request('/admin/healthLife/saveUserHealthLifeStyleContent', {
    method: 'POST',
    data,
  });
}

// 打卡设置 end

// 广告管理

// get 广告管理 - 广告列表
export function fetchBannerList(params) {
  return request('/admin/systemConfig/listBannerMarketPlatform', {
    params,
  });
}

// get 广告管理 - 获取banner图片分辨率
export function fetchBannerRatio(params) {
  return request('/admin/systemConfig/getBannerPictureResolutionConfig', {
    params,
  });
}

// get 广告管理 - 获取详情
export function fetchBannerDetail(params) {
  return request('/admin/systemConfig/getBannerMarketPlatformById', {
    params,
  });
}

// post 广告管理 - 下架/图片删除 修改
export function fetchBannerStatusDel(data) {
  return request('/admin/systemConfig/updateBannerMarketPlatform', {
    method: 'POST',
    data,
  });
}

// post 广告管理 - 新增
export function fetchBannerSet(data) {
  return request('/admin/systemConfig/saveBannerMarketPlatform', {
    method: 'POST',
    data,
  });
}

// 广告管理 end

// 热门搜索

// get 热门搜索 - 回显
export function fetchSearchGetData(params) {
  return request('/common/category/getHotMerchantCategory', {
    params,
  });
}

// post 热门搜索 - 配置
export function fetchSearchSet(data) {
  return request('/common/category/setHotMerchantCategory', {
    method: 'POST',
    data,
  });
}

// 热门搜索 end

// 拼图广告

// get 拼图广告 - 列表
export function fetchPuzzleAdList(params) {
  return request('/admin/puzzleAdsManagement/listPuzzleAdsManagement', {
    params,
  });
}

// get 拼图广告 -  拼团广告详情
export function fetchPuzzleAdDetail(params) {
  return request('/admin/puzzleAdsManagement/getPuzzleAdsById', {
    params,
  });
}

// get 拼图广告 - 获取广告配置
export function fetchPuzzleAdRoot(params) {
  return request('/admin/systemConfig/listAdvertisingConfig', {
    params,
  });
}

// post 拼图广告 - 广告配置修改
export function fetchPuzzleAdRootSet(data) {
  return request('/admin/systemConfig/updateAdvertisingConfig', {
    method: 'POST',
    data,
  });
}

// post 拼图广告 - 添加修改
export function fetchPuzzleAdSet(data) {
  return request('/admin/puzzleAdsManagement/saveOrUpdatePuzzleAds', {
    method: 'POST',
    data,
  });
}

// 拼图广告 end
