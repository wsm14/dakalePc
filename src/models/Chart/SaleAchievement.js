import { fetchSaleAchievementList } from '@/services/ChartServices';

export default {
  namespace: 'saleAchievement',

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
      const response = yield call(fetchSaleAchievementList, payload);
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
    *fetchGetExcel({ payload, callBack }, { call }) {
      const response = yield call(fetchSaleAchievementList, payload);
      if (!response) return;
      const { content } = response;
      callBack(content.recordList);
    },
  },
};
