import { notification } from 'antd';
import {
  fetchMarketMatch,
  fetchMarketRMTotal,
  fetchMarketMatchJoin,
  fetchMarketMatchMorningSet,
  fetchMarketMatchRuningSet,
} from '@/services/MarketServices';

export default {
  namespace: 'marketCardRMing',

  state: {
    matchList: { list: [], total: 0 },
    joinList: { list: [], total: 0 },
    totalData: {},
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
      const response = yield call(fetchMarketMatch, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          matchList: { list: content.record, total: content.total },
        },
      });
    },
    *fetchMarketRMTotal({ payload }, { call, put }) {
      const response = yield call(fetchMarketRMTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content,
        },
      });
    },
    *fetchMarketMatchJoin({ payload }, { call, put }) {
      const response = yield call(fetchMarketMatchJoin, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          joinList: { list: content.record, total: content.total },
        },
      });
    },
    *fetchMarketMatchMorningSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketMatchMorningSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '早起挑战赛设置成功',
      });
      callback();
    },
    *fetchMarketMatchRuningSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketMatchRuningSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '步数挑战赛设置成功',
      });
      callback();
    },
  },
};
