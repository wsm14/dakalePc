import { notification } from 'antd';
import {
  fetchFeedBackList,
  fetchFeedBackPush,
  fetchFeedBackDetail,
} from '@/services/ServiceServices';

export default {
  namespace: 'messagePush',

  state: {
    list: { list: [], total: 0 },
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
      const response = yield call(fetchFeedBackList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.dtoList, total: content.total },
        },
      });
    },
    *fetchFeedBackDetail({ payload, callback }, { call }) {
      const response = yield call(fetchFeedBackDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.userFeedbackDTO);
    },
    *fetchFeedBackPush({ payload, callback }, { call, put }) {
      const response = yield call(fetchFeedBackPush, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '反馈成功',
      });
      callback();
    },
  },
};
