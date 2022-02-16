import { fetchVerificationList } from '@/services/OperationServices';

export default {
  namespace: 'verificationList',
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
    *fetchVerificationList({ payload }, { call, put }) {
      const response = yield call(fetchVerificationList, payload);
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
  },
};
