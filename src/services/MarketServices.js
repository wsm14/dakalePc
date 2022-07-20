import request from '@/utils/request';

// get 营销活动 - 拉新活动列表
export async function fetchMarketAddNewActivity(params) {
  return request('/admin/configFissionTemplateNew/pageListConfigFissionTemplate', {
    params,
  });
}

// get 营销活动 - 拉新活动详情
export async function fetchMarketAddNewActivityDetail(params) {
  return request('/admin/configFissionTemplateNew/getConfigFissionTemplateById', {
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
  return request('/admin/configFissionTemplateNew/saveConfigFissionTemplate', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 拉新活动编辑
export function fetchMarketAddNewActivityEdit(data) {
  return request('/admin/configFissionTemplateNew/updateConfigFissionTemplate', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 拉新活动下架
export function fetchMarketAddNewActivityCancel(data) {
  return request('/admin/configFissionTemplateNew/offShelfConfigFissionTemplate', {
    method: 'POST',
    data,
  });
}

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

// get 视频广告 - 获取金币视频详情
export function fetchGoldVideoDetail(params) {
  return request('/admin/dictionary/admin/getDictionaryByParentAndChild', {
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

// post 视频广告 - 分享赚  - 修改
export function fetchVideoSetUpdatePlatfromMomentDirect(data) {
  return request('/admin/marketing/moment/platform/updatePlatfromMomentDirect', {
    method: 'POST',
    data,
  });
}

// post 视频广告 - 金币视频  - 修改
export function fetchVideoSetUpdateGoldVideoDirect(data) {
  return request('/admin/dictionary/admin/updateDictionaryExtraParam', {
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

// 开团列表
export function fetchAdminListStartGroup(params) {
  return request('/admin/start/group/adminListStartGroup', {
    params,
  });
}
//参团列表
export function fetchAdminListJoinGroupByGroupId(params) {
  return request('/admin/start/group/adminListJoinGroupByGroupId', {
    params,
  });
}

// 立即成团
export function fetchSimulationStartGroup(data) {
  return request('/admin/start/group/simulationStartGroup', {
    method: 'POST',
    data,
  });
}

// 营销活动 start

// get 营销活动 - 列表
export function fetchMarketActivityList(params) {
  return request('/admin/marketing/activity/admin/pageListMarketingActivity', {
    params,
  });
}

// get 营销活动 - 详情
export function fetchMarketActivityDetail(params) {
  return request('/admin/marketing/activity/admin/getMarketingActivity', {
    params,
  });
}

// get 营销活动 - 报名商品 - 电商品
export function fetchMarketActivityOnlineGoods(params) {
  return request('/admin/marketing/activity/admin/listActivityOnlineGoodsByPage', {
    params,
  });
}

// get 营销活动 - 报名商品 - 特惠商品
export function fetchMarketActivityOfflineGoods(params) {
  return request('/admin/marketing/activity/admin/listActivityOfflineGoodsByPage', {
    params,
  });
}

// post 营销活动 - 报名商品 - 校验商品
export function fetchMarketActivityCheckGoods(data) {
  return request('/admin/marketing/activity/admin/verifyWhenSelectingGoods', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 报名商品 - 添加商品
export function fetchMarketActivityGoodsSave(data) {
  return request('/admin/marketing/activity/admin/registeredProducts', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 报名商品 - 修改商品库存
export function fetchMarketActivityGoodsEditRemain(data) {
  return request('/admin/marketing/activity/admin/adjustActiveInventory', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 新增
export function fetchMarketActivityAdd(data) {
  return request('/admin/marketing/activity/admin/saveMarketingActivity', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 编辑
export function fetchMarketActivityEdit(data) {
  return request('/admin/marketing/activity/admin/updateMarketingActivity', {
    method: 'POST',
    data,
  });
}

// post 营销活动 - 下架
export function fetchMarketActivityDown(data) {
  return request('/admin/marketing/activity/admin/offShelfMarketingActivity', {
    method: 'POST',
    data,
  });
}

// 营销活动 end

// 限时秒杀

// get 营销活动 - 限时秒杀 - 电商品列表
export function fetchSeckillTimeCommerceGoodsList(params) {
  return request('/admin/marketing/seckill/admin/listSeckillOnlineGoodsByPage', {
    params,
  });
}

// get 营销活动 - 限时秒杀 - 特惠商品列表
export function fetchSeckillTimeSpecialGoodsList(params) {
  return request('/admin/marketing/seckill/admin/listSeckillOfflineGoodsByPage', {
    params,
  });
}

// 限时秒杀 end
