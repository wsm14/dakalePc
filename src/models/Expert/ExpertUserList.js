import { notification } from 'antd';
import {
  fetchExpertUserTotal,
  fetchExpertUserList,
  fetchExpertStop,
  fetchExpertOpen,
} from '@/services/ExpertServices';

export default {
  namespace: 'expertUserList',

  state: {
    list: { list: [], total: 0 },
    userTotal: 0,
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
      const response = yield call(fetchExpertUserList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchExpertUserTotal({ payload }, { call, put }) {
      const response = yield call(fetchExpertUserTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userTotal: content.kolCount,
        },
      });
    },
    *fetchExpertStop({ payload, callback }, { call, put }) {
      const response = yield call(fetchExpertStop, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '封停设置成功',
      });
      callback();
    },
    *fetchExpertOpen({ payload, callback }, { call, put }) {
      const response = yield call(fetchExpertOpen, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '解封成功',
      });
      callback();
    },
  },
};
