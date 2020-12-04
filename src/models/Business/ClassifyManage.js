import { fetchClassifyList, fetchClassifyGetMre } from '@/services/BusinessServices';

export default {
  namespace: 'classifyManage',

  state: {
    list: [],
    total: 0,
    mreSelect: [],
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
      const response = yield call(fetchClassifyList, payload);
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
    *fetchClassifyGetMre({ payload }, { call, put }) {
      const response = yield call(fetchClassifyGetMre, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          mreSelect: content.userMerchantList.map((item) => ({
            name: item.merchantName,
            value: item.merchantId,
          })),
        },
      });
    },
  },
};
