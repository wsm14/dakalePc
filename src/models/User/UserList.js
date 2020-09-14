import { notification } from 'antd';
import {
  fetchUserList,
  fetchUserDetail,
  fetchUserStatus,
  fetchUserTotal,
  fetchUserAddTotal,
  fetchUserCityTotal,
} from '@/services/UserServices';

export default {
  namespace: 'userList',

  state: {
    list: [],
    totalData: {},
    totalSperadData: { city: [] },
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
      const response = yield call(fetchUserTotal, payload);
      const responseTow = yield call(fetchUserAddTotal, payload);
      if (!response) return;
      if (!responseTow) return;
      const { content } = response;
      const { content: contentTwo } = responseTow;
      const {
        userRealNameCount: userAddRealNameCount = 0,
        userTopUpCount: userAddTopUpCount = 0,
      } = contentTwo;
      yield put({
        type: 'save',
        payload: {
          totalData: { ...content, userAddRealNameCount, userAddTopUpCount },
        },
      });
    },
    *fetchUserTotalSperad({ payload }, { call, put }) {
      const response = yield call(fetchUserCityTotal, payload);
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
