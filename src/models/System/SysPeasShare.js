import { notification } from 'antd';
import {
  fetchPeasShareList,
  fetchPeasShareDetail,
  fetchPeasShareAdd,
  fetchPeasShareEdit,
  fetchPeasShareDel,
} from '@/services/SystemServices';

export default {
  namespace: 'sysPeasShare',

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
      const response = yield call(fetchPeasShareList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.roleList,
          total: content.totalCount,
        },
      });
    },
    *fetchPeasShareDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchPeasShareDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.roleInfo);
    },
    *fetchPeasShareAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchPeasShareAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    *fetchPeasShareEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchPeasShareEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改成功',
      });
      callback();
    },
    *fetchPeasShareDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchPeasShareDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '删除成功',
      });
      callback();
    },
  },
};
