import { notification } from 'antd';
import {
  fetchTradeList,
  fetchTradeDetail,
  fetchTradeAdd,
  fetchTradeDel,
  fetchTradeEdit,
} from '@/services/SystemServices';

export default {
  namespace: 'sysTradeList',

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
      const response = yield call(fetchTradeList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.list,
          total: content.total,
        },
      });
    },
    *fetchTradeDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
    },
    *fetchTradeAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增类目成功',
      });
      callback();
    },
    *fetchTradeEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改类目成功',
      });
      callback();
    },
    *fetchTradeDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '删除类目成功',
      });
      callback();
    },
  },
};
