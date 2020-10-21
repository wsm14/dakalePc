import { fetchExpertUserTotal, fetchExpertUserList } from '@/services/ExpertServices';

export default {
  namespace: 'expertUserList',

  state: {
    list: { list: [], total: 0 },
    userTotal: 0,
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
      const response = yield call(fetchExpertUserList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.mobile ? [content] : [] },
        },
      });
    },
    *fetchExpertUserTotal({ payload }, { call, put }) {
      const response = yield call(fetchExpertUserTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userTotal: content.kolCount,
        },
      });
    },
  },
};
