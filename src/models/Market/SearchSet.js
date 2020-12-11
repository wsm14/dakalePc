import { notification } from 'antd';
import { fetchSearchSet } from '@/services/MarketServices';

export default {
  namespace: 'searchSet',

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
    *fetchSearchSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchSearchSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '配置成功',
      });
      callback();
    },
  },
};
