import { fetchExpertUserAchievementList } from '@/services/ExpertServices';

export default {
  namespace: 'expertUserAchievement',

  state: {
    list: { list: [], total: 0 },
    userTotal: 0,
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
      const response = yield call(fetchExpertUserAchievementList, payload);
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
