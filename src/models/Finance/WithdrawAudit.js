import { fetchWithdrawAuditCommunityList } from '@/services/FinanceServices';

export default {
  namespace: 'withdrawAudit',

  state: {
    communityList: { list: [], total: 0 },
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
    *fetchWithdrawAuditCommunityList({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawAuditCommunityList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          communityList: { list: content.recordList, total: content.total },
        },
      });
    },
    // *fetchPlatformInconmeDetail({ payload, callback }, { call }) {
    //   const response = yield call(fetchPlatformInconmeDetail, payload);
    //   if (!response) return;
    //   const { content } = response;
    //   callback(content.order);
    // },
  },
};
