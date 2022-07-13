import { fetchAssistanceList, fetchAssistanceDetail } from '@/services/DataStatementServices';

export default {
  namespace: 'blindboxAssistance',

  state: {
    list: {
      list: [],
      total: 0,
    },
    info: {
      list: [],
    },
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
      const response = yield call(fetchAssistanceList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchAssistanceDetail({ payload }, { call, put }) {
      const response = yield call(fetchAssistanceDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          info: {
            list: content.userBlindBoxHelpDTOS,
          },
        },
      });
    },
  },
};
