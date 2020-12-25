import { notification } from 'antd';
import {
  fetchUserList,
  fetchUserDetail,
  fetchUserStatus,
  fetchUserTotal,
  fetchUserInfoTotal,
  fetchUserAddTotal,
  fetchUserCityTotal,
  fetchUserJuhe,
} from '@/services/UserServices';

export default {
  namespace: 'userList',

  state: {
    list: { list: [], total: 0 },
    totalData: {},
    totalSperadData: { city: [] },
    totalInfo: {},
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
          list: { list: content.recordList, total: content.total },
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
    *fetchUserInfoTotal({ payload }, { call, put }) {
      const response = yield call(fetchUserInfoTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          // 异常或空数据
          totalInfo: {
            ...content,
            age: Object.keys(content.age).map((item) => ({
              type: { [item]: `${item}`, '60+岁': '60岁以上', 异常或空数据: '未知' }[item],
              value: content.age[item],
            })),
          },
        },
      });
    },
    *fetchUserJuhe({ payload }, { call }) {
      const response = yield call(fetchUserJuhe, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '执行成功',
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
