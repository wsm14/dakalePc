import { fetchOrderSalesAnalysisReport } from '@/services/DataStatement';

export default {
  namespace: 'marketStatement',

  state: {
    orderList: { list: [], total: 0 },
    sum: {},
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
    *fetchOrderSalesAnalysisReport({ payload }, { call, put }) {
      const response = yield call(fetchOrderSalesAnalysisReport, payload);
      if (!response) return;
      const { content = {} } = response;
      const { sum = {}, recordList = [], total = 0 } = content;

      yield put({
        type: 'save',
        payload: {
          orderList: { list: recordList, total },
          sum,
        },
      });
    },
  },
};
