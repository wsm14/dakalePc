import { fetchExpertUserDistributionList } from '@/services/ExpertServices';

export default {
  namespace: 'expertUserDistribution',

  state: {
    list: { list: [], total: 0 },
    shareBeanSum: 0,
    teamBeanSum: 0,
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
      const response = yield call(fetchExpertUserDistributionList, payload);
      if (!response) return;
      const { content } = response;
      const { shareBeanSum = 0, teamBeanSum = 0, recordList, total } = content;
      yield put({
        type: 'save',
        payload: {
          list: { list: recordList, total },
          shareBeanSum,
          teamBeanSum,
        },
      });
    },
  },
};
