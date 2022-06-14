import { notification } from 'antd';
import { fetchMarketActivityList } from '@/services/MarketServices';

export default {
  namespace: 'marketActivity',

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
      const response = yield call(fetchMarketActivityList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.marketingActivityDetailList,
          total: content.total,
        },
      });
    },
    *fetchAreaQueryCityInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchAreaQueryInfo, payload);
      if (!response) return;
      const { content } = response;
      callback(content.agentPriceList);
    },
    *fetchAreaQueryInfoSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchAreaQueryInfoSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '信息设置成功',
      });
      callback();
    },
  },
};
