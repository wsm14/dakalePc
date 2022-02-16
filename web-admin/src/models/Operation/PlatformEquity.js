import { notification } from 'antd';
import { fetchGiveGoods } from '@/services/OperationServices';

export default {
  namespace: 'platformEquity',

  state: {},

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  effects: {
    *fetchGiveGoods({ payload, callback }, { call }) {
      const response = yield call(fetchGiveGoods, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `赠送成功`,
      });
      callback();
    },
  },
};
