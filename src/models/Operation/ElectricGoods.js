import { notification } from 'antd';
import moment from 'moment';
import { fetchListOnlineGoodsByPage } from '@/services/OperationServices';

export default {
  namespace: 'electricGoods',

  state: {
    list: { list: [], total: 0 },
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
      const response = yield call(fetchListOnlineGoodsByPage, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.onlineDetails,
            total: content.total,
          },
        },
      });
    },
  },
};
