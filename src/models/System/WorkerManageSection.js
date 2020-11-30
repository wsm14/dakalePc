import { notification } from 'antd';
import {
  fetchWMSSectionList,
  fetchWMSSectionAdd,
  fetchWMSSectionEdit,
} from '@/services/SystemServices';

export default {
  namespace: 'workerManageSection',

  state: {
    list: [],
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
      const response = yield call(fetchWMSSectionList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList || [],
        },
      });
    },
    *fetchWMSSectionAdd({ payload, callback }, { call }) {
      const response = yield call(fetchWMSSectionAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '部门新增成功',
      });
      callback();
    },
    *fetchWMSSectionEdit({ payload, callback }, { call }) {
      const response = yield call(fetchWMSSectionEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '部门修改成功',
      });
      callback();
    },
  },
};
