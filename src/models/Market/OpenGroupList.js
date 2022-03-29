import { notification } from 'antd';
import moment from 'moment';
import { fetchPuzzleAdList } from '@/services/MarketServices';

export default {
  namespace: 'openGroupList',

  state: { list: [], total: 0 },

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
      const response = yield call(fetchPuzzleAdList, payload);
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
  },
};
