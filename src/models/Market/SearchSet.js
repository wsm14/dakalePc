import { notification } from 'antd';
import { fetchSearchSet, fetchSearchGetData } from '@/services/MarketServices';

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
    *fetchSearchGetData({ payload, callback }, { call }) {
      const response = yield call(fetchSearchGetData, payload);
      if (!response) return;
      const { content } = response;
      const listData = JSON.parse(content.dictionaryDTO.extraParam || '{}');
      if (callback)
        callback(
          listData.merchantList
            ? listData.merchantList.map((item) => ({ label: item.merchantName, value: item.id }))
            : [],
        );
    },
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
