import { fetchPlatformInconme } from '@/services/FinanceServices';

export default {
  namespace: 'platformIncome',

  state: {
    list: { list: [], total: 0 },
    totalBean: 0,
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
    *fetchPlatformInconme({ payload }, { call, put }) {
      const response = yield call(fetchPlatformInconme, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.platformRevenueList,
          totalBean: Number(content.totalBean),
        },
      });
    },
  },
};
