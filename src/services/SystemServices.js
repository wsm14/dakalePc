import request from '@/utils/request';

// 特惠商品类目配置

// get 特惠商品类目配置 - 版本列表 / 城市列表 / 配置列表
export function fetchListConfigSpecialGoodsCategory(params) {
  return request('/admin/configSpecialGoodsCategory/listConfigSpecialGoodsCategory', {
    params,
  });
}

// post 特惠商品类目配置 - 新增版本 / 新增城市 / 新增配置
export function fetchSaveConfigSpecialGoodsCategory(data) {
  return request('/admin/configSpecialGoodsCategory/saveConfigSpecialGoodsCategory', {
    method: 'POST',
    data,
  });
}

// post 特惠商品类目配置 - 修改版本 / 修改配置
export function fetchUpdateConfigSpecialGoodsCategory(data) {
  return request('/admin/configSpecialGoodsCategory/updateConfigSpecialGoodsCategory', {
    method: 'POST',
    data,
  });
}

// get 特惠商品类目配置 - 配置详情
export function fetchGetConfigSpecialGoodsCategoryById(params) {
  return request('/admin/configSpecialGoodsCategory/getConfigSpecialGoodsCategoryById', {
    params,
  });
}

// 特惠商品类目配置  end

// 菜单设置

// get 菜单设置 - 菜单 - 获取菜单
export function fetchMenuList(params) {
  return request('/admin/access/listAllAccess', {
    params,
  });
}

// get 菜单设置 - 菜单 - 获取菜单信息
export function fetchGetMenuDetail(params) {
  return request('/admin/access/getAccessById', {
    params,
  });
}

// post 菜单设置 - 菜单 - 新增 修改
export function fetchMenuSet(data) {
  return request('/admin/access/saveAuthAccess', {
    method: 'POST',
    data,
  });
}

// 菜单设置 end

// 城市管理

// get 城市管理 - 城市列表
export function fetchCityManageList(params) {
  return request('/admin/locationCityManagement/listLocationCity', {
    params,
  });
}

// post 城市管理 - 新增修改
export function fetchCityManageSet(data) {
  return request('/admin/locationCityManagement/saveOrUpdateLocationCity', {
    method: 'POST',
    data,
  });
}

// post 城市管理 - 状态修改
export function fetchCityManageStatus(data) {
  return request('/admin/locationCityManagement/deleteLocationCity', {
    method: 'POST',
    data,
  });
}

// 城市管理 end

// 哒人配置

// get 哒人配置 - 列表
export function fetchExpertAllocationList(params) {
  return request('/admin/systemConfig/listUserLevel', {
    params,
  });
}

// post 哒人配置 - 新增
export function fetchExpertAllocationSave(data) {
  return request('/admin/systemConfig/saveUserLevel', {
    method: 'POST',
    data,
  });
}

// post 哒人配置 - 修改
export function fetchExpertAllocationEdit(data) {
  return request('/admin/systemConfig/updateUserLevel', {
    method: 'POST',
    data,
  });
}

// 哒人配置 end

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

// 逛逛页面配置

// get 热门城市配置 - 列表
export function fetchHotCityPageList(params) {
  return request('/admin/dictionaryAdmin/getDictionaryAdmin', {
    params,
  });
}

// post 热门城市配置 - 设置
export function fetchHotCityPageConfig(data) {
  return request('/admin/systemConfig/setHotCityConfig', {
    method: 'POST',
    data,
  });
}

// get 风向标配置 - 列表
export function fetchWalkManageVaneList(params) {
  return request('/admin/windVane/listConfigWindVane', {
    params,
  });
}

// get 风向标配置 - 详情
export function fetchWalkManageVaneDetail(params) {
  return request('/admin/configWindVane/getConfigWindVaneManagementById', {
    params,
  });
}

// post 风向标配置 - 编辑删除
export function fetchWalkManageVaneEditDel(data) {
  return request('/admin/configWindVane/updateConfigWindVaneManagement', {
    method: 'POST',
    data,
  });
}

// post 风向标配置 - 排序
export function fetchWalkManageVaneSort(data) {
  return request('/admin/configWindVane/sortConfigWindVane', {
    method: 'POST',
    data,
  });
}

// post 风向标配置 - 新增
export function fetchWalkManageVaneAdd(data) {
  return request('/admin/windVane/saveConfigWindVane', {
    method: 'POST',
    data,
  });
}

// get 导航类目页面配置 - 列表 / 风向标配置 - 获取场景选择
export function fetchWalkManageNavigation() {
  return request('/admin/systemIndustry/listAllCategoryScenes');
}

// post 导航类目页面配置 - 排序
export function fetchWalkManageNavigationSort(data) {
  return request('/admin/systemConfig/configCategoryNavigation', {
    method: 'POST',
    data,
  });
}

// get 特惠商品类目配置 - 列表
export function fetchWalkManageGratiaClass() {
  return request('/common/category/listSpecialGoodsCategory');
}

// post 导航类目页面配置 - 新增
export function fetchWalkManageGratiaClassAdd(data) {
  return request('/common/category/setSpecialGoodsCategory', {
    method: 'POST',
    data,
  });
}

// 集合页配置列表
export function fetchGatherPageConfigList(params) {
  return request('/admin/collectionPage/listConfigCollectionPage', {
    params,
  });
}

//集合页新增
export function fetchGatherPageConfigAdd(data) {
  return request('/admin/collectionPage/saveConfigCollectionPage', {
    method: 'POST',
    data,
  });
}

//集合页编辑
export function fetchGatherPageConfigUpdate(data) {
  return request('/admin/collectionPage/updateConfigCollectionPage', {
    method: 'POST',
    data,
  });
}
// 集合页结束
export function fetchGatherPageConfigEnd(data) {
  return request('/admin/collectionPage/endConfigCollectionPage', {
    method: 'POST',
    data,
  });
}

//逛逛模块化配置-版本列表
export function fetchAroundModuleList(params) {
  return request('/admin/wanderAroundModule/listWanderAroundModule', {
    params,
  });
}

//逛逛模块化配置-新增版本
export function fetchAroundModuleAdd(data) {
  return request('/admin/wanderAroundModule/saveWanderAroundModule', {
    method: 'POST',
    data,
  });
}

//逛逛模块化配置-修改版本
export function fetchAroundModuleEdit(data) {
  return request('/admin/wanderAroundModule/updateWanderAroundModule', {
    method: 'POST',
    data,
  });
}

//逛逛模块化配置-新增城市
export function fetchWanderAroundModuleAdd(data) {
  return request('/admin/wanderAroundModule/saveWanderAroundModule', {
    method: 'POST',
    data,
  });
}

//逛逛模块化配置-编辑
export function fetchUpdateWanderAroundModule(data) {
  return request('/admin/wanderAroundModule/updateWanderAroundModule', {
    method: 'POST',
    data,
  });
}

//逛逛模块化配置-详情
export function fetchGetWanderAroundModuleById(params) {
  return request('/admin/wanderAroundModule/getWanderAroundModuleById', {
    params,
  });
}

//逛逛模块化配置-风向标配置-版本列表-城市列表-风向标列表
export function fetchGetWindVaneManagementList(params) {
  return request('/admin/configWindVane/listConfigWindVaneManagement', {
    params,
  });
}

//逛逛模块化配置-风向标配置-版本新增-新增城市
export function fetchGetWindVaneManagementAdd(data) {
  return request('/admin/configWindVane/saveConfigWindVaneManagement', {
    method: 'POST',
    data,
  });
}

//逛逛模块化配置-风向标配置-版本修改
export function fetchGetWindVaneManagementEdit(data) {
  return request('/admin/configWindVane/updateConfigWindVaneManagement', {
    method: 'POST',
    data,
  });
}

//逛逛模块化配置-自我游商品配置-版本列表-城市列表-配置列表
export function fetchGetSelfTourGoodsList(params) {
  return request('/admin/configSelfTourGoods/listConfigSelfTourGoods', {
    params,
  });
}

//逛逛模块化配置-自我游商品配置-版本新增-新增城市
export function fetchGetSelfTourGoodsAdd(data) {
  return request('/admin/configSelfTourGoods/saveConfigSelfTourGoods', {
    method: 'POST',
    data,
  });
}

//逛逛模块化配置-自我游商品配置-版本修改-配置修改
export function fetchGetSelfTourGoodsEdit(data) {
  return request('/admin/configSelfTourGoods/updateConfigSelfTourGoods', {
    method: 'POST',
    data,
  });
}

//逛逛模块化配置-自我游商品配置-配置详情
export function fetchGetSelfTourGoodsDetail(params) {
  return request('/admin/configSelfTourGoods/getConfigSelfTourGoodsById', {
    params,
  });
}

// 逛逛页面配置 end

// 新人下单配置 start

//新人下单配置列表
export function fetchWelfareConfigList(params) {
  return request('/admin/systemConfig/listConfigNewcomerOrders', {
    params,
  });
}

//  新增、修改 新人下单配置
export function fetchWelfareUpdate(data) {
  return request('/admin/systemConfig/saveOrUpdateConfigNewcomerOrders', {
    method: 'POST',
    data,
  });
}

// 删除 新人下单配置
export function fetchWelfareDelete(data) {
  return request('/admin/systemConfig/deleteConfigNewcomerOrders', {
    method: 'POST',
    data,
  });
}

// 新人下单配置 end

// 提现规则

// get 提现规则 - 列表
export function fetchWithdrawRegularList(params) {
  return request('/admin/systemConfig/listConfigWithdraw', {
    params,
  });
}

// post 提现规则 - 新增编辑
export function fetchWithdrawUpdate(data) {
  return request('/admin/systemConfig/saveOrUpdateConfigWithdraw', {
    method: 'POST',
    data,
  });
}

// 提现规则 end

// 分佣模板 list  start

// 分佣模板 list
export function fetchDivisionTemplateList(params) {
  return request('/admin/division/template/listDivisionTemplate', {
    params,
  });
}

// 分佣模板-详情
export function fetchDivisionTemplateDetail(params) {
  return request('/admin/division/template/getTemplateById', {
    params,
  });
}

// 分佣模板-新增
export function fetchDivisionTemplateAdd(data) {
  return request('/admin/division/template/createDivisionTemplate', {
    method: 'POST',
    data,
  });
}

//分佣模板-修改
export function fetchDivisionTemplateUpdate(data) {
  return request('/admin/division/template/updateDivisionTemplate', {
    method: 'POST',
    data,
  });
}

// 分佣模板 end

// 全局配置

// 全局配置设置分享图片
export function fetchInviteImgSave(data) {
  return request('/admin/shareImg/saveShareImg', {
    method: 'POST',
    data,
  });
}

// 获取分享图片
export function fetchInviteImgList(params) {
  return request('/admin/shareImg/getShareImg', {
    params,
  });
}

// 节日配置 get 列表
export function fetchListFestivalConfig(params) {
  return request('/admin/festival/listFestivalConfig', {
    params,
  });
}

//节日配置新增
export function fetchSaveFestivalConfig(data) {
  return request('/admin/festival/saveFestivalConfig', {
    method: 'POST',
    data,
  });
}

//节日配置编辑
export function fetchUpdateFestivalConfig(data) {
  return request('/admin/festival/updateFestivalConfig', {
    method: 'POST',
    data,
  });
}

// 节日配置详情
export function fetchFestivalConfigDetail(params) {
  return request('/admin/festival/getFestivalConfig', {
    params,
  });
}

// 节日配置下架
export function fetchFestivalConfigDown(data) {
  return request('/admin/festival/offShelfFestivalConfig', {
    method: 'POST',
    data,
  });
}

//视频标签配置-列表
export function fetchListMomentTag(params) {
  return request('/admin/momentTag/listMomentTag', {
    params,
  });
}

//视频标签配置-新增
export function fetchSaveMomentTagAdd(data) {
  return request('/admin/momentTag/saveMomentTag', {
    method: 'POST',
    data,
  });
}

//视频标签配置-详情
export function fetchGetMomentTagById(params) {
  return request('/admin/momentTag/getMomentTagById', {
    params,
  });
}

//视频标签配置-编辑
export function fetchUpdateMomentTag(data) {
  return request('/admin/momentTag/updateMomentTag', {
    method: 'POST',
    data,
  });
}

//首页tab配置-版本列表
export function fetchIndexTabList(params) {
  return request('/admin/indexTab/listIndexTab', {
    params,
  });
}

//首页tab配置-新增版本
export function fetchIndexTabAdd(data) {
  return request('/admin/indexTab/saveIndexTab', {
    method: 'POST',
    data,
  });
}

//首页tab配置-编辑
export function fetchIndexTabEdit(data) {
  return request('/admin/indexTab/updateIndexTab', {
    method: 'POST',
    data,
  });
}

//首页tab配置-详情
export function fetchGetIndexTabById(params) {
  return request('/admin/indexTab/getIndexTabById', {
    params,
  });
}

// 读取充值分享海报配置
export function fetchGetRechargeShareImg(params) {
  return request('/admin/shareImg/getRechargeShareImg', {
    params,
  });
}

// 充值分享海报配置
export function fetchSaveRechargeShareImg(data) {
  return request('/admin/shareImg/saveRechargeShareImg', {
    method: 'POST',
    data,
  });
}

// get 虚拟商品优惠比例配置 -  分页列表
export function fetchPagePreferentialActivity(params) {
  return request('/admin/preferentialActivity/pagePreferentialActivity', {
    params,
  });
}

// get 虚拟商品优惠比例配置-详情
export function fetchGetPreferentialActivityById(params) {
  return request('/admin/preferentialActivity/getPreferentialActivityById', {
    params,
  });
}

// post 虚拟商品优惠比例配置-编辑
export function fetchUpdatePreferentialActivity(data) {
  return request('/admin/preferentialActivity/updatePreferentialActivity', {
    method: 'POST',
    data,
  });
}

// post 虚拟商品优惠比例配置-新增
export function fetchSavePreferentialActivity(data) {
  return request('/admin/preferentialActivity/savePreferentialActivity', {
    method: 'POST',
    data,
  });
}

//获取默认卡豆抵扣比例
export function fetchGetDefaultPreferentialActivity(params) {
  return request('/admin/preferentialActivity/getDefaultPreferentialActivity', {
    params,
  });
}

//底部中心icon配置 - 版本列表
export function fetchListConfigBottomCenterIcon(params) {
  return request('/admin/configBottomCenterIcon/listConfigBottomCenterIcon', {
    params,
  });
}

//底部中心icon配置 - 新增版本
export function fetchSaveConfigBottomCenterIcon(data) {
  return request('/admin/configBottomCenterIcon/saveConfigBottomCenterIcon', {
    method: 'POST',
    data,
  });
}

//底部中心icon配置 - 编辑版本 / 编辑配置
export function fetchUpdateConfigBottomCenterIcon(data) {
  return request('/admin/configBottomCenterIcon/updateConfigBottomCenterIcon', {
    method: 'POST',
    data,
  });
}

//底部中心icon配置 - 编辑获取详情
export function fetchGetConfigBottomCenterIconById(params) {
  return request('/admin/configBottomCenterIcon/getConfigBottomCenterIconById', {
    params,
  });
}

// 全局配置 end

// 资源位内容配置

//资源位模板-  不分页列表\查询
export function fetchListResourceTemplate(params) {
  return request('/admin/resourceTemplate/listResourceTemplate', {
    params,
  });
}

//资源位模板-  详情、获取配置
export function fetchGetResourceTemplateById(params) {
  return request('/admin/resourceTemplate/getResourceTemplateById', {
    params,
  });
}

//资源位内容配置-  分页列表
export function fetchPageResourceTemplateContent(params) {
  return request('/admin/resourceTemplateContent/pageResourceTemplateContent', {
    params,
  });
}

//资源位内容配置 - 新增
export function fetchSaveResourceTemplateContent(data) {
  return request('/admin/resourceTemplateContent/saveResourceTemplateContent', {
    method: 'POST',
    data,
  });
}

//资源位内容配置 - 编辑
export function fetchUpdateResourceTemplateContent(data) {
  return request('/admin/resourceTemplateContent/updateResourceTemplateContent', {
    method: 'POST',
    data,
  });
}

//资源位内容配置 - 删除
export function fetchDeleteResourceTemplateContent(data) {
  return request('/admin/resourceTemplateContent/deleteResourceTemplateContent', {
    method: 'POST',
    data,
  });
}

//资源位内容配置-  详情
export function fetchGetResourceTemplateContentById(params) {
  return request('/admin/resourceTemplateContent/getResourceTemplateContentById', {
    params,
  });
}

// 资源位内容配置 end

//拼团配置
export function fetchGetListTogetherGroupConfig(params) {
  return request('/admin/together/group/config/listTogetherGroupConfig', {
    params,
  });
}

// 商品配置
export function fetchSaveTogetherGroupConfig(data) {
  return request('/admin/together/group/config/saveTogetherGroupConfig', {
    method: 'POST',
    data,
  });
}
//
export function fetchListActivityForSearch(params) {
  return request('/admin/specialGoodsManagement/listActivityForSearch', {
    params,
  });
}

// 排序
export function fetchUpdateSort(data) {
  return request('/admin/together/group/config/updateSort', {
    method: 'POST',
    data,
  });
}
// 删除  
export function fetchDeleteConfigGoods(data) {
  return request('/admin/together/group/config/deleteConfigGoods', {
    method: 'POST',
    data,
  });
}
