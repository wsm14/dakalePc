import { notification } from 'antd';
import { fetchFeedBackList, fetchFeedBackPush } from '@/services/ActiveServices';

export default {
  namespace: 'activeTemplate',

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
          list: { list: [], total: content.total },
        },
      });
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
