import { notification } from 'antd';
import {
  fetchMarketActivityList,
  fetchMarketActivityAdd,
  fetchMarketActivityEdit,
  fetchMarketActivityDown,
} from '@/services/MarketServices';

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
    *fetchMarketActivitySet({ payload, callback }, { call }) {
      const { mode, ...other } = payload;
      const fetchApi = { add: fetchMarketActivityAdd, edit: fetchMarketActivityEdit }[mode];
      const fetchText = { add: '创建', edit: '修改' }[mode];
      const response = yield call(fetchApi, other);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `活动${fetchText}成功`,
      });
      callback();
    },
    *fetchMarketActivityDown({ payload, callback }, { call }) {
      const response = yield call(fetchMarketActivityDown, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '活动下架成功',
      });
      callback();
    },
  },
};
