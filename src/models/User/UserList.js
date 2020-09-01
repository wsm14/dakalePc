import { notification } from 'antd';
import { fetchUserList, fetchUserDetail, fetchUserStatus } from '@/services/UserServices';

export default {
  namespace: 'userList',

  state: {
    list: [],
    totalData: {},
    totalSperadData: {},
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
      const response = yield call(fetchUserList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.user.userIdString ? [content.user] : [],
        },
      });
    },
    *fetchUserDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchUserDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.userDetail);
    },
    *fetchUserTotal({ payload }, { call, put }) {
      const response = yield call(fetchUserDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content,
        },
      });
    },
    *fetchUserTotalSperad({ payload }, { call, put }) {
      const response = yield call(fetchUserDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalSperadData: content,
        },
      });
    },
    *fetchUserStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchUserStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '用户状态修改成功',
      });
      callback();
    },
  },
};
