import { fetchMomentKanBan } from '@/services/ChartServices';

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
    *fetchMomentKanBan({ payload }, { call, put }) {
      const response = yield call(fetchMomentKanBan, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          realTimeData: content,
        },
      });
    },
  },
};
