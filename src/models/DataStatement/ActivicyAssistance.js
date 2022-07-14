import {
  fetchActivicyAssistanceList,
  fetchActivicyAssistanceDetail,
} from '@/services/DataStatementServices';

export default {
  namespace: 'activicyAssistance',

  state: {
    list: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
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
      const response = yield call(fetchActivicyAssistanceList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.userFissionDetailList,
            total: content.total,
          },
        },
      });
    },
    *fetchActivicyAssistanceDetail({ payload }, { call, put }) {
      const response = yield call(fetchActivicyAssistanceDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: {
            list: content.userFissionHelpDetailList,
            total: content.total,
          },
        },
      });
    },
  },
};
