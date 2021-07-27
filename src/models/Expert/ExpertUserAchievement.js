import {
  fetchExpertUserAchievementList,
  fetchExpertUserAchievementRecommend,
  fetchExpertUserSubCommissionStatistics,
} from '@/services/ExpertServices';

export default {
  namespace: 'expertUserAchievement',

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
      const response = yield call(fetchExpertUserAchievementList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.userList, total: content.total },
        },
      });
    },
    *fetchExpertUserAchievementRecommend({ payload }, { call, put, select }) {
      const { kolUserId } = payload;
      const response = yield call(fetchExpertUserAchievementRecommend, payload);
      if (!response) return;
      const { content } = response;
      const recommendList = yield select((state) => state.expertUserAchievement.recommendList);
      yield put({
        type: 'save',
        payload: {
          recommendList: {
            ...recommendList,
            [kolUserId]: { list: content.recordList, total: content.total },
          },
        },
      });
    },
    *fetchExpertUserSubCommissionStatistics({ payload }, { call, put }) {
      const response = yield call(fetchExpertUserSubCommissionStatistics, payload);
      if (!response) return;
      const { content = {} } = response;
      const { recordList = {} } = content;
      const { kolCommissionStatisticMonthList = [], ...other } = recordList;
      yield put({
        type: 'save',
        payload: {
          subList: {
            list: kolCommissionStatisticMonthList,
            total: content.total,
          },
          subTotal: other,
        },
      });
    },
  },
};
