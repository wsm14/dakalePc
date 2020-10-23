import { notification } from 'antd';
import {
  fetchActiveAdd,
  fetchActiveEdit,
  fetchSourceMerchant,
  fetchSourceGoods,
  fetchActiveList,
} from '@/services/ActiveServices';

export default {
  namespace: 'activeTemplate',

  state: {
    merList: { list: [], total: 0 },
    goodsList: { list: [], total: 0 },
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
    *fetchActiveAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchActiveAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增活动成功',
      });
      callback();
    },
    *fetchActiveEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchActiveEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改活动成功',
      });
      callback();
    },
    *fetchSourceMerchant({ payload, callback }, { call }) {
      const response = yield call(fetchSourceMerchant, payload);
      if (!response) return;
      const { content } = response;
      callback({ list: content.recordList, total: content.total });
    },
    *fetchActiveList({ payload, callback }, { call }) {
      const response = yield call(fetchActiveList, payload);
      if (!response) return;
      const { content } = response;
      callback({ list: content.recordList, total: content.total });
    },
    *fetchSourceGoods({ payload, callback }, { call }) {
      const response = yield call(fetchSourceGoods, payload);
      if (!response) return;
      const { content } = response;
      callback({ list: content.recordList, total: content.total });
    },
  },
};
