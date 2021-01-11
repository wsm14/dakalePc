import { notification } from 'antd';
import {
  fetchGetHubName,
  fetchGetHubSelect,
  fetchGetTradeSelect,
  fetchSetTradeSelect,
  fetchGetMreTag,
} from '@/services/BaseServices';

export default {
  namespace: 'baseData',

  state: {
    hubData: [],
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
    *fetchGetHubData({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetHubSelect, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          hubData: content.businessHubList,
        },
      });
      if (callback) callback(content.businessHubList);
    },
    *fetchGetMreTag({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetMreTag, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content.tagNames);
    },
    *fetchGetTradeSelect({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetTradeSelect, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content.categoryIds);
    },
    *fetchGetHubName({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetHubName, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content.businessHubList);
    },
    *fetchSetTradeSelect({ payload, callback }, { call, put }) {
      const response = yield call(fetchSetTradeSelect, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '设置成功',
      });
      callback();
    },
  },
};
