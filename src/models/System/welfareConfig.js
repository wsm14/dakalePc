import { notification } from 'antd';
import {
  fetchWelfareConfigList,
  fetchWelfareUpdate,
  fetchWelfareDelete,
} from '@/services/SystemServices';
export default {
  namespace: 'welfareConfigList',
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
    *fetchWelfareConfigLists({ payload }, { call, put }) {
      const response = yield call(fetchWelfareConfigList, payload);
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
    *fetchWelfareUpdates({ payload, callback }, { call, put }) {
      const response = yield call(fetchWelfareUpdate, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '配置成功',
      });
      callback();
    },
    *fetchWelfareDeletes({ payload, callback }, { call }) {
      const response = yield call(fetchWelfareDelete, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '删除成功',
      });
      callback();
    },
  },
};
