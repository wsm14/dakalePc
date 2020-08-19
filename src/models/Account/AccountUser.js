import { fetchAccountUserTotal, fetchAccountUserList } from '@/services/AccountServices';

export default {
  namespace: 'accountUser',

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
      const response = yield call(fetchAccountUserList, payload);
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
    *fetchUserTotal({ payload }, { call, put }) {
      const response = yield call(fetchAccountUserTotal, payload);
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
