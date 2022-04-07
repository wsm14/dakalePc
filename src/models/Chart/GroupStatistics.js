import { fetchTogetherRebateStatistic,fetchTogetherRebateReport } from '@/services/ChartServices';

export default {
  namespace: 'groupStatistics',

  state: {
    realTimeData: {},
    staticsData: {},
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
    *fetchTogetherRebateStatistic({ payload }, { call, put }) {
      const response = yield call(fetchTogetherRebateStatistic, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          realTimeData: content,
        },
      });
    },
    *fetchTogetherRebateReport({ payload }, { call, put }) {
      const response = yield call(fetchTogetherRebateReport, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          staticsData: content.togetherRebateAnalysisInfo,
        },
      });
    },
  },
};
