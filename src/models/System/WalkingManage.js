import { notification } from 'antd';
import {
  fetchWalkManageVaneList,
  fetchWalkManageVaneDetail,
  fetchWalkManageVaneSort,
  fetchWalkManageVaneAdd,
  fetchWalkManageVaneEditDel,
  fetchWalkManageNavigation,
  fetchWalkManageNavigationSort,
  fetchWalkManageGratiaClass,
  fetchWalkManageGratiaClassAdd,
  fetchGatherPageConfigList,
  fetchGatherPageConfigAdd,
  fetchGatherPageConfigUpdate,
  fetchGatherPageConfigEnd,
  fetchAroundModuleList,
  fetchAroundModuleAdd,
  fetchAroundModuleEdit,
  fetchWanderAroundModuleAdd,
  fetchHotCityPageList,
  fetchHotCityPageConfig,
  fetchUpdateWanderAroundModule,
  fetchGetWanderAroundModuleById,
  fetchGetWindVaneManagementList,
  fetchGetWindVaneManagementAdd,
  fetchGetWindVaneManagementEdit,
} from '@/services/SystemServices';

export default {
  namespace: 'walkingManage',

  state: {
    vaneList: { list: [] },
    navigation: { list: [] },
    class: [],
    gatherList: { list: [] },
    nowTrade: [],
    editionList: { list: [] },
    configureList: { list: [] },
    hotCity: { list: [], dictionaryId: '' },
    vaneEditionList: { list: [] },
    vaneCityList: { list: [] },
    vaneConfigureList: { list: [] },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  effects: {
    // 删除热门城市
    *fetchHotCityPageConfigDel({ payload, callback }, { call }) {
      const response = yield call(fetchHotCityPageConfig, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '热门城市删除成功',
      });
      callback();
    },
    // 修改热门城市
    *fetchHotCityPageConfigChange({ payload, callback }, { call }) {
      const response = yield call(fetchHotCityPageConfig, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '热门城市修改成功',
      });
      callback();
    },
    // 热门城市排序
    *fetchHotCityPageConfigSort({ payload, callback }, { call }) {
      const response = yield call(fetchHotCityPageConfig, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '热门城市排序成功',
      });
      callback();
    },
    // 读取热门城市配置
    *fetchHotCityPageList({ payload }, { call, put }) {
      const response = yield call(fetchHotCityPageList, payload);
      if (!response) return;
      const { content } = response;
      // console.log(JSON.parse(content.dictionary.extraParam), 'content');
      yield put({
        type: 'save',
        payload: {
          hotCity: {
            list: JSON.parse(content.dictionary.extraParam).map((i) => ({
              ...i,
              cityCode: `${i.cityCode}`,
            })),
            dictionaryId: content.dictionary.dictionaryId,
          },
        },
      });
    },
    *fetchWalkManageVaneList({ payload }, { call, put }) {
      const response = yield call(fetchWalkManageVaneList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          vaneList: { list: content.configWindVaneList },
        },
      });
    },
    *fetchWalkManageVaneDetail({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageVaneDetail, payload);
      if (!response) return;
      const { configWindVaneDTO } = response.content;
      const { bubbleFlag, param = '{}', jumpType, nativeJumpType } = configWindVaneDTO;
      const { categoryId, topCategoryId } = JSON.parse(param || '{}');
      callback({
        ...configWindVaneDTO,
        jumpType: {
          native: nativeJumpType === 'windVaneCategory' ? 'trade' : 'native',
          url: jumpType,
        }[jumpType],
        windVaneParamObject: JSON.parse(param || '{}'),
        bubbleFlag: Boolean(Number(bubbleFlag)),
        categoryId: categoryId ? categoryId.split(',') : [],
        topCategoryId: topCategoryId ? [topCategoryId] : [],
      });
    },
    *fetchWalkManageVaneEditDel({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageVaneEditDel, payload);
      if (!response) return;
      const { deleteFlag } = payload;
      notification.success({
        message: '温馨提示',
        description: `风向标${deleteFlag === 0 ? '删除' : '修改'}成功`,
      });
      callback();
    },
    *fetchWalkManageVaneSort({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageVaneSort, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '风向标排序成功',
      });
      callback();
    },
    *fetchWalkManageVaneAdd({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageVaneAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '风向标新增成功',
      });
      callback();
    },
    *fetchWalkManageNavigation({ payload }, { call, put }) {
      const response = yield call(fetchWalkManageNavigation, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          navigation: {
            list: content.recordList,
          },
        },
      });
    },
    *fetchWalkManageNavigationSort({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageNavigationSort, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '类目排序成功',
      });
      callback();
    },
    *fetchWalkManageGratiaClass({ payload }, { call, put }) {
      const response = yield call(fetchWalkManageGratiaClass, payload);
      if (!response) return;
      const { content } = response;
      const nowTrade = []; // 当前已选的类目用做剔除
      const list = content.categoryList.map((item) => {
        nowTrade.push(item.categoryIdString);
        return { ...item, id: item.categoryIdString };
      });
      yield put({
        type: 'save',
        payload: {
          class: list,
          nowTrade,
        },
      });
    },
    *fetchWalkManageGratiaClassAdd({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageGratiaClassAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '类型设置成功',
      });
      callback();
    },
    *fetchGatherPageConfigList({ payload }, { call, put }) {
      const response = yield call(fetchGatherPageConfigList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          gatherList: { list: content.configCollectionPageList },
        },
      });
    },
    *fetchGatherPageConfigAdd({ payload, callback }, { call }) {
      const response = yield call(fetchGatherPageConfigAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    *fetchGatherPageConfigUpdate({ payload, callback }, { call }) {
      const response = yield call(fetchGatherPageConfigUpdate, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    *fetchGatherPageConfigEnd({ payload, callback }, { call }) {
      const response = yield call(fetchGatherPageConfigEnd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '结束成功',
      });
      callback();
    },
    *fetchAroundModuleList({ payload }, { call, put }) {
      const response = yield call(fetchAroundModuleList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          editionList: {
            list: content.configWanderAroundModuleList,
          },
        },
      });
    },
    *fetchAroundModuleCityList({ payload }, { call, put }) {
      const response = yield call(fetchAroundModuleList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          configureList: { list: content.configWanderAroundModuleList },
        },
      });
    },
    *fetchAroundModuleAdd({ payload, callback }, { call }) {
      const response = yield call(fetchAroundModuleAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    *fetchAroundModuleEdit({ payload, callback }, { call }) {
      const response = yield call(fetchAroundModuleEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '编辑成功',
      });
      callback();
    },
    *fetchWanderAroundModuleAdd({ payload, callback }, { call }) {
      const response = yield call(fetchWanderAroundModuleAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    *fetchUpdateWanderAroundModule({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateWanderAroundModule, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '保存成功',
      });
      callback();
    },
    *fetchGetWanderAroundModuleById({ payload, callback }, { call }) {
      const response = yield call(fetchGetWanderAroundModuleById, payload);
      if (!response) return;
      const { content } = response;
      const strollContent = content;
      callback(content?.configWanderAroundModule);
    },
    //逛逛模块化配置-风向标配置-版本列表
    *fetchGetWindVaneEditionList({ payload }, { call, put }) {
      const response = yield call(fetchGetWindVaneManagementList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          vaneEditionList: { list: content.configWindVaneDTOS },
        },
      });
    },
    //逛逛模块化配置-风向标配置-城市列表
    *fetchGetWindVaneCityList({ payload }, { call, put }) {
      const response = yield call(fetchGetWindVaneManagementList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          vaneCityList: { list: content.configWindVaneDTOS },
        },
      });
    },
    //逛逛模块化配置-风向标配置-配置列表
    *fetchGetWindVaneConfigureList({ payload }, { call, put }) {
      const response = yield call(fetchGetWindVaneManagementList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          vaneConfigureList: { list: content.configWindVaneDTOS },
        },
      });
    },
    //逛逛模块化配置-风向标配置-版本新增-新增城市
    *fetchGetWindVaneManagementAdd({ payload, callback }, { call }) {
      const response = yield call(fetchGetWindVaneManagementAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    //逛逛模块化配置-风向标配置-版本修改
    *fetchGetWindVaneManagementEdit({ payload, callback }, { call }) {
      const response = yield call(fetchGetWindVaneManagementEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '编辑成功',
      });
      callback();
    },
  },
};
