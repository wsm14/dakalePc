import { fetchMerSettledList, fetchGetMerSettledExcel } from '@/services/BusinessServices';

export default {
  namespace: 'businessSettled',

  state: {
    list: [],
    total: 0,
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
      const response = yield call(fetchMerSettledList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
          total: content.total,
        },
      });
    },
    *fetchMerchantGetExcel({ payload, callback }, { call }) {
      const response = yield call(fetchGetMerSettledExcel, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.userMerchantDTOList);
    },
  },
};
