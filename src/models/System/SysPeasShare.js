import { notification } from 'antd';
import {
  fetchPeasShareList,
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
          list: content.recordList,
          total: content.totalCount,
        },
      });
    },
    *fetchPeasShareAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchPeasShareAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '卡豆分享新增成功',
      });
      callback();
    },
    *fetchPeasShareEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchPeasShareEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '卡豆分享修改成功',
      });
      callback();
    },
    *fetchPeasShareDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchPeasShareDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '卡豆分享删除成功',
      });
      callback();
    },
  },
};
