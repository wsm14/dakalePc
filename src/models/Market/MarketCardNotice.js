import { notification } from 'antd';
import { fetchUserList, fetchUserStatus } from '@/services/UserServices';

export default {
  namespace: 'marketCardNotice',

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
      const response = yield call(fetchUserList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.record,
          total: content.total,
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
