import { fetchPlatformInconme, fetchPlatformInconmeDetail } from '@/services/FinanceServices';

export default {
  namespace: 'platformIncome',

  state: {
    list: { list: [], total: 0 },
    totalBean: 0,
    orderDetail: {},
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
          list: { list: content.platformRevenueList, total: content.total },
          totalBean: Number(content.totalBean),
        },
      });
    },
    *fetchPlatformInconmeDetail({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          orderDetail: {},
        },
      });
      const response = yield call(fetchPlatformInconmeDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          orderDetail: content.order,
        },
      });
    },
  },
};
