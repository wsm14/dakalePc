import { fetchAccountBusinessList, fetchAccountBusinessTotal } from '@/services/AccountServices';

export default {
  namespace: 'accountBusiness',

  state: {
    list: [],
    total: 0,
    totalData: {},
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
      const response = yield call(fetchAccountBusinessList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.list,
          total: data.total,
        },
      });
    },
    *fetchBusinessTotal({ payload }, { call, put }) {
      const response = yield call(fetchAccountBusinessTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content.userMerchantList,
        },
      });
    },
  },
};
