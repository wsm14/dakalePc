import { fetchActiveList, fetchActiveDetail } from '@/services/ActiveServices';

export default {
  namespace: 'activeList',

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
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchActiveList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.activityTemplateList,
          total: content.total,
        },
      });
    },
    *fetchActiveDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchActiveDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.activityTemplate);
    },
  },
};
