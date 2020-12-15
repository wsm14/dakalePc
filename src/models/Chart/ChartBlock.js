import { fetchChartBlockOrder } from '@/services/ChartServices';

export default {
  namespace: 'chartBlock',

  state: {
    orderInfo: {},
    userInfo: {},
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
    *fetchChartBlockOrder({ payload }, { call, put }) {
      const response = yield call(fetchChartBlockOrder, payload);
      if (!response) return;
      const { content } = response;
      const allTotal = Object.values(content.orderInfo).reduce((prev, next) => ({
        totalFee: prev.totalFee + next.totalFee,
        docCount: prev.docCount + next.docCount,
      }));
      yield put({
        type: 'save',
        payload: {
          orderInfo: { allTotal, ...content.orderInfo },
        },
      });
    },
  },
};
