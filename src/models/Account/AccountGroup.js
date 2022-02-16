import {
  fetchListMerchantGroupAccount,
} from '@/services/AccountServices';

const data1 = [
  {
    statisticDesc: '无',
    content: 0,
  },
];

export default {
  namespace: 'accountGroup',

  state: {
    list: { list: [], total: 0 },
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
      const response = yield call(fetchListMerchantGroupAccount, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
  },
};
