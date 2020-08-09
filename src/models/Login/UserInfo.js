import { fetchQueryCurrent, fetchGetAuthMenuTree } from '@/services/LoginServices';

export default {
  namespace: 'userInfo',
  state: {
    currentUser: {},
    menuList: [],
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(fetchQueryCurrent);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'saveCurrentUser',
        payload: content.adminInfo,
      });
    },
    *fetchGetAuthMenuTree({ payload }, { call, put }) {
      const response = yield call(fetchGetAuthMenuTree, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          menuList: content.accessList,
        },
      });
    },
  },
  reducers: {
    saveCurrentUser(state, { payload }) {
      return { ...state, currentUser: payload || {} };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
