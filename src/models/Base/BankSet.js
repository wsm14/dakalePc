import { notification } from 'antd';
import {
  fetchMerBankSetList,
  fetchMerBankAll,
  fetchMerBankAdd,
  fetchMerBankEdit,
} from '@/services/BaseServices';

export default {
  namespace: 'businessBankSet',

  state: {
    list: [],
    total: 0,
    bankTopArr: [],
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
      const response = yield call(fetchMerBankSetList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
          total: content.total,
        },
      });
    },
    *fetchMerBankTop({ payload }, { call, put }) {
      const response = yield call(fetchMerBankAll, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          bankTopArr: content.bankNameList,
        },
      });
    },
    *fetchMerBankAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerBankAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '支行设置成功',
      });
      callback();
    },
    *fetchMerBankEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerBankEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '支行修改成功',
      });
      callback();
    },
  },
};
