import { notification } from 'antd';
import moment from 'moment';
import {
  fetchGetListTogetherGroupConfig,
  fetchSaveTogetherGroupConfig,
  fetchListActivityForSearch,
  fetchUpdateSort,
  fetchDeleteConfigGoods,
} from '@/services/SystemServices';
export default {
  namespace: 'groupGoods',

  state: {
    list: [],
    total: 0,
    activityGoodsList: [],
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
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchGetListTogetherGroupConfig, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.togetherGroupConfigList,
          total: content.total,
        },
      });
    },
    *fetchSaveTogetherGroupConfig({ payload, callback }, { call }) {
      const response = yield call(fetchSaveTogetherGroupConfig, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '配置成功',
      });
      callback && callback();
    },
    *fetchListActivityForSearch({ payload, callback }, { call, put }) {
      const response = yield call(fetchListActivityForSearch, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          activityGoodsList: content.activityGoodsList,
        },
      });
      callback && callback(content.activityGoodsList);
    },
    *fetchUpdateSort({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateSort, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '设置成功',
      });
      callback && callback();
    },
    *fetchDeleteConfigGoods({ payload, callback }, { call }) {
      const response = yield call(fetchDeleteConfigGoods, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '删除成功',
      });
      callback && callback();
    },
  },
};
