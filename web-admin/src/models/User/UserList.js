import { notification } from 'antd';
import {
  fetchUserList,
  fetchUserDetail,
  fetchUserStatus,
  fetchUserTotal,
  fetchUserChartTotal,
} from '@/services/UserServices';

export default {
  namespace: 'userList',

  state: {
    list: { list: [], total: 0 },
    totalData: {},
    totalChartData: { city: [] },
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
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content,
        },
      });
    },
    *fetchUserChartTotal({ payload }, { call, put }) {
      const response = yield call(fetchUserChartTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalChartData: {
            ...content,
            tag: Object.keys(content.tag).map((item) => ({
              tag: item,
              count: content.tag[item],
            })),
            age: Object.keys(content.age).map((item) => ({
              type: { [item]: `${item}`, '60+岁': '60岁以上', 异常或空数据: '未知' }[item],
              value: content.age[item],
            })),
          },
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
