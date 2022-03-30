import { notification } from 'antd';
import moment from 'moment';
import {
  fetchGetListTogetherGroupConfig,
  fetchSaveTogetherGroupConfig,
  fetchListActivityForSearch,
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
      const { content } = response;
      notification.success({
        message: '温馨提示',
        description: '修改成功',
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
          list: content.activityGoodsList,
        },
      });
      callback && callback(content.activityGoodsList);
    },
  },
};
