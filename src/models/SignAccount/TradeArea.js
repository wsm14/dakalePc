import moment from 'moment';
import { notification } from 'antd';
import {
  fetchTradeAreaList,
  fetchTradeAreaAdd,
  fetchTradeAreaEdit,
} from '@/services/SignAccountServices';

export default {
  namespace: 'tradeArea',

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
      const response = yield call(fetchTradeAreaList, payload);
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
    *fetchTradeAreaAdd({ payload, callback }, { call }) {
      const response = yield call(fetchTradeAreaAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商圈新增成功',
      });
      callback();
    },
    *fetchTradeAreaEdit({ payload, callback }, { call }) {
      const response = yield call(fetchTradeAreaEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商圈修改成功',
      });
      callback();
    },
  },
};
