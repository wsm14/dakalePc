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
  fetchUpdateWanderAroundModule,
  fetchGetWanderAroundModuleById,
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
      const { configWindVane } = response.content;
      const { bubbleFlag, param = '{}', jumpType, nativeJumpType } = configWindVane;
      const { categoryId, topCategoryId } = JSON.parse(param || '{}');
      callback({
        ...configWindVane,
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
          editionList: { list: content.configWanderAroundModuleList },
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
  },
};
