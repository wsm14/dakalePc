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

// get 营销活动 - 拉新活动列表
export async function fetchMarketAddNewActivity(params) {
  return request('/admin/configFissionTemplate/listConfigFissionTemplate', {
    params,
  });
}

// get 营销活动 - 拉新活动详情
export async function fetchMarketAddNewActivityDetail(params) {
  return request('/admin/configFissionTemplate/getConfigFissionTemplateById', {
    params,
  });
}

// get 营销活动 - 拉新活动多选商品详情
export async function fetchAddNewActivityDetailCheck(params) {
  return request('/admin/specialGoodsManagement/listSpecialGoodsByIds', {
    params,
  });
}

// post 营销活动 - 拉新活动新增
export function fetchMarketAddNewActivityAdd(data) {
  return request('/admin/configFissionTemplate/saveConfigFissionTemplate', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 拉新活动编辑
export function fetchMarketAddNewActivityEdit(data) {
  return request('/admin/configFissionTemplate/updateConfigFissionTemplate', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 拉新活动下架
export function fetchMarketAddNewActivityCancel(data) {
  return request('/admin/configFissionTemplate/offShelfConfigFissionTemplate', {
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

// banner管理

// get banner管理 - 广告列表
export function fetchBannerList(params) {
  return request('/admin/bannerManagement/listBannerMarketPlatform', {
    params,
  });
}

// get banner管理 - banner图片位置+banner图片分辨率 -列表
export function fetchBannerRatio(params) {
  return request('/admin/configBannerType/listConfigBannerType', {
    params,
  });
}

// get banner管理 - 获取详情
export function fetchBannerDetail(params) {
  return request('/admin/bannerManagement/getBannerMarketPlatformById', {
    params,
  });
}

// post banner管理 - 下架/图片 修改
export function fetchBannerEdit(data) {
  return request('/admin/bannerManagement/updateBannerMarketPlatform', {
    method: 'POST',
    data,
  });
}

// post banner管理 - 下架/图片 下架 上架 删除
export function fetchBannerStatus(data) {
  return request('/admin/bannerManagement/onOffOrDeleteBannerMarketPlatform', {
    method: 'POST',
    data,
  });
}

// post banner管理 - 新增
export function fetchBannerSet(data) {
  return request('/admin/bannerManagement/saveBannerMarketPlatform', {
    method: 'POST',
    data,
  });
}

// post banner管理 - banner图片位置 - 新增
export function fetchSaveConfigBannerType(data) {
  return request('/admin/configBannerType/saveConfigBannerType', {
    method: 'POST',
    data,
  });
}

// banner管理 end

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

// post 拼图广告 - 上下架，删除
export function fetchPuzzleAdStatus(data) {
  return request('/admin/puzzleAdsManagement/onOffOrDeletePuzzleAds', {
    method: 'POST',
    data,
  });
}

// 拼图广告 end

// 开屏广告

// get 开屏广告 - 列表
export function fetchOpenAdvertList(params) {
  return request('/admin/launchImage/listAppLaunchImage', {
    params,
  });
}

// get 开屏广告 - 详情
export function fetchOpenAdvertDetail(params) {
  return request('/admin/launchImage/getAppLaunchImage', {
    params,
  });
}

// post 开屏广告 - 添加
export function fetchOpenAdvertSet(data) {
  return request('/admin/launchImage/saveLaunchImage', {
    method: 'POST',
    data,
  });
}

// post 开屏广告 - 更新
export function fetchOpenAdvertEdit(data) {
  return request('/admin/launchImage/updateAppLaunchImage', {
    method: 'POST',
    data,
  });
}

// post 开屏广告 - 上下架 删除
export function fetchOpenAdvertStatus(data) {
  return request('/admin/launchImage/onOffAppLaunchImage', {
    method: 'POST',
    data,
  });
}

// 开屏广告 end

// 视频广告

// get 视频广告 - 列表
export function fetchVideoAdvertList(params) {
  return request('/admin/marketing/moment/platform/momentList', {
    params,
  });
}

// post 视频广告 - 下架
export function fetchVideoAdvertStatus(data) {
  return request('/admin/marketing/moment/platform/offMoment', {
    method: 'POST',
    data,
  });
}

// post 视频广告 - 新增
export function fetchVideoAdvertCreate(data) {
  return request('/admin/marketing/moment/platform/createMoment', {
    method: 'POST',
    data,
  });
}

// post 视频广告 - 修改
// post 视频广告 - 设置初始收藏数和分享数
export function fetchVideoAdvertEdit(data) {
  return request('/admin/marketing/moment/platform/updateMoment', {
    method: 'POST',
    data,
  });
}

// get 视频广告 - 详情
export function fetchVideoAdvertDetail(params) {
  return request('/admin/marketing/moment/platform/momentDetail', {
    params,
  });
}

// get 视频广告 - 配置详情
export function fetchVideoAdvertRootCount(params) {
  return request('/admin/marketing/moment/platform/getConfig', {
    params,
  });
}

// post 视频广告 - 配置数量
export function fetchVideoAdvertRootCountSet(data) {
  return request('/admin/marketing/moment/platform/setConfig', {
    method: 'POST',
    data,
  });
}

// get 视频标签 - 列表
export function fetchVideoListMomentTag(params) {
  return request('/admin/momentTag/listMomentTag', {
    params,
  });
}

// get 视频广告 - 分享赚豆
export function fetchVideoGetDictionaryAdmin(params) {
  return request('/admin/dictionaryAdmin/getDictionaryAdmin', {
    params,
  });
}

// post 视频广告 - 分享赚豆 - 编辑
export function fetchVideoSetShareEarnBeanRule(data) {
  return request('/admin/marketing/moment/new/setShareEarnBeanRule', {
    method: 'POST',
    data,
  });
}

// 视频广告 end

// 新手视频

// get 新手视频 - 列表
export function fetchVideoAdNovice(params) {
  return request('/admin/guideMomentsManagement/listGuideMoments', {
    params,
  });
}

// get 新手视频 - 领豆明细
export function fetchVideoAdNoviceBean(params) {
  return request('/admin/guideMomentsManagement/listGuideMomentsDetail', {
    params,
  });
}

// get 新手视频 - 详情
export function fetchVideoAdNoviceDetail(params) {
  return request('/admin/guideMomentsManagement/getGuideMomentsById', {
    params,
  });
}

// post 新手视频 - 发布分享
export function fetchVideoAdNoviceSet(data) {
  return request('/admin/guideMomentsManagement/saveGuideMoments', {
    method: 'POST',
    data,
  });
}

// post 新手视频 - 下架
export function fetchVideoAdNoviceStatus(data) {
  return request('/admin/guideMomentsManagement/offShelfGuideMoments', {
    method: 'POST',
    data,
  });
}

// 开屏广告 end

// 区域查询系统

// get 区域查询系统 - 获取详情
export function fetchAreaQueryInfo(params) {
  return request('/admin/agentPrice/listAgentPriceByPid', {
    params,
  });
}

// post 区域查询系统 - 签约 修改代理商价格
export function fetchAreaQueryInfoSet(data) {
  return request('/admin/agentPrice/updateAgentPrice', {
    method: 'POST',
    data,
  });
}

// 区域查询系统 end

//营销功能配置
// get 全局弹窗配置 - 版本列表
export function fetchGlobalPopUpList(params) {
  return request('/admin/configGlobalPopUp/listConfigGlobalPopUp', {
    params,
  });
}

// post 全局弹窗配置-新增版本-新增城市-新增版本-新增配置
export function fetchGlobalPopUpAdd(data) {
  return request('/admin/configGlobalPopUp/saveConfigGlobalPopUp', {
    method: 'POST',
    data,
  });
}

// post 全局弹窗配置-修改版本-编辑配置-编辑权重-下架-删除
export function fetchGlobalPopUpEdit(data) {
  return request('/admin/configGlobalPopUp/updateConfigGlobalPopUp', {
    method: 'POST',
    data,
  });
}

// post 全局弹窗配置-详情
export function fetchGlobalPopUpConfigureDetail(params) {
  return request('/admin/configGlobalPopUp/getConfigGlobalPopUpById', {
    params,
  });
}

// get 浮窗配置 - 版本列表
export function fetchFloatingWindowList(params) {
  return request('/admin/configFloatingWindow/listConfigFloatingWindowManagement', {
    params,
  });
}

// post 浮窗配置-新增版本-新增城市-新增版本-新增配置
export function fetchFloatingWindowAdd(data) {
  return request('/admin/configFloatingWindow/saveConfigFloatingWindow', {
    method: 'POST',
    data,
  });
}

// post 全局弹窗配置-修改版本-编辑配置-编辑权重-下架-删除
export function fetchFloatingWindowEdit(data) {
  return request('/admin/configFloatingWindow/updateConfigFloatingWindow', {
    method: 'POST',
    data,
  });
}

// post 全局弹窗配置-详情
export function fetchFloatingWindowDetail(params) {
  return request('/admin/configFloatingWindow/getConfigFloatingWindowById', {
    params,
  });
}

// get 新人福利弹窗 - 列表
export function fetchListConfigNewUserPopUp(params) {
  return request('/admin/configNewUserPopUp/listConfigNewUserPopUp', {
    params,
  });
}

// get 新人福利弹窗 - 详情
export function fetchGetConfigNewUserPopUpById(params) {
  return request('/admin/configNewUserPopUp/getConfigNewUserPopUpById', {
    params,
  });
}

// post 新人福利弹窗 - 新增
export function fetchSaveConfigNewUserPopUp(data) {
  return request('/admin/configNewUserPopUp/saveConfigNewUserPopUp', {
    method: 'POST',
    data,
  });
}

// post 新人福利弹窗 - 编辑
export function fetchUpdateConfigNewUserPopUp(data) {
  return request('/admin/configNewUserPopUp/updateConfigNewUserPopUp', {
    method: 'POST',
    data,
  });
}

// get 周卡配置 - 详情
export function fetchGetWeeklyCard(params) {
  return request('/admin/weeklyCard/getWeeklyCard', {
    params,
  });
}

// post 周卡配置 - 编辑
export function fetchSetWeeklyCard(data) {
  return request('/admin/weeklyCard/setWeeklyCard', {
    method: 'POST',
    data,
  });
}
