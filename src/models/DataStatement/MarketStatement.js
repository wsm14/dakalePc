import { fetchOrderSalesAnalysisReport } from '@/services/DataStatementServices';

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
    clearOrderList(state, { payload }) {
      return {
        ...state,
        orderList: { list: [], total: 0 },
        sum: {},
      };
    },
  },

  effects: {
    *fetchOrderSalesAnalysisReport({ payload }, { call, put }) {
      const { startStatisticDay = '' } = payload;
      if (!startStatisticDay) return;
      const response = yield call(fetchOrderSalesAnalysisReport, { ...payload, limit: 50 });
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
