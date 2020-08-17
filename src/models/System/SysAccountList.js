import { notification } from 'antd';
import {
  fetchSysAccountList,
  fetchAccountEdit,
  fetchGetAccountInfo,
} from '@/services/SystemServices';

export default {
  namespace: 'sysAccountList',

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
      const response = yield call(fetchSysAccountList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.adminList,
          total: content.totalCount,
        },
      });
    },
    *fetchGetAccountInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetAccountInfo, payload);
      if (!response) return;
      const { content } = response;
      callback(content.adminInfo);
    },
    *fetchAccountEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchAccountEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '管理员设定成功',
      });
      callback();
    },
  },
};
