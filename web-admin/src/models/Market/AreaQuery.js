import { notification } from 'antd';
import { fetchAreaQueryInfo, fetchAreaQueryInfoSet } from '@/services/MarketServices';

export default {
  namespace: 'areaQuery',

  state: {
    list: [],
    province: [],
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
    *fetchAreaQueryInfo({ payload }, { call, put }) {
      const response = yield call(fetchAreaQueryInfo, payload);
      if (!response) return;
      const { content } = response;
      const { level } = payload;
      yield put({
        type: 'save',
        payload: {
          [level === 1 ? 'province' : 'list']: content.agentPriceList,
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
