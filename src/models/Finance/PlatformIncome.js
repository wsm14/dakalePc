import { fetchPlatformInconme, fetchPlatformInconmeDetail } from '@/services/FinanceServices';

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
    *fetchPlatformInconme({ payload, callback }, { call, put }) {
      const response = yield call(fetchPlatformInconme, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.platformRevenueList, total: content.total },
          totalBean: Number(content.totalBean),
        },
      });
      callback && callback(content.platformRevenueList);
    },
    *fetchPlatformInconmeDetail({ payload, callback }, { call }) {
      const response = yield call(fetchPlatformInconmeDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.order);
    },
  },
};
