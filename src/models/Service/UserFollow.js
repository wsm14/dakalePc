import { notification } from 'antd';
import {
  fetchListUserFollowUp,
  fetchGetUserFollowUp,
  fetchGetDictionaryAdmin,
  fetchGetUserDetail,
} from '@/services/ServiceServices';

export default {
  namespace: 'userFollow',

  state: {
    list: [],
    total: 0,
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
    *fetchGetList({ payload, callback }, { call, put }) {
      const response = yield call(fetchListUserFollowUp, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
          total: content.total,
        },
      });
      callback &&
        callback({
          list: content.recordList,
          total: content.total,
        });
    },
    *fetchGetUserFollowUp({ payload, callback }, { call }) {
      const response = yield call(fetchGetUserFollowUp, payload);
      if (!response) return;
      const { content } = response;
      callback(content.userFollowUp);
    },
    *fetchGetDictionaryAdmin({ payload, callback }, { call }) {
      const response = yield call(fetchGetDictionaryAdmin, payload);
      if (!response) return;
      const { content } = response;
      callback(content.dictionary);
    },
    *fetchGetUserDetail({ payload, callback }, { call }) {
      const response = yield call(fetchGetUserDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.userDetail);
    },
  },
};
