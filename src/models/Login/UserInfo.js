import { notification } from 'antd';
import { fetchQueryCurrent, fetchGetAuthMenuTree } from '@/services/LoginServices';
import { fetchPassWordEdit } from '@/services/SystemServices';

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
    *fetchPassWordEdit({ payload }, { call }) {
      const response = yield call(fetchPassWordEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改密码成功',
      });
    },
    *fetchGetAuthMenuTree({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetAuthMenuTree, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          menuList: content.accessList,
        },
      });
      if (callback) callback(content.accessList);
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
