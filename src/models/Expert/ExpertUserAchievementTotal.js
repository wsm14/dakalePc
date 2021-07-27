import { fetchExpertUserAchievementTotalList } from '@/services/ExpertServices';

export default {
  namespace: 'expertUserAchievementTotal',

  state: {
    list: { list: [], total: 0 },
    subList: { list: [], total: 0 },
    subTotal: {},
    recommendList: {},
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    closeRecommend(state) {
      return {
        ...state,
        recommendList: {},
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchExpertUserAchievementTotalList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.userList, total: content.total },
        },
      });
    },
  },
};
