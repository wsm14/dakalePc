import { notification } from 'antd';
import {
  fetchMarketNoticeList,
  fetchMarketNoticeAdd,
  fetchMarketNoticeSet,
} from '@/services/MarketServices';

export default {
  namespace: 'marketCardNotice',

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
      const response = yield call(fetchMarketNoticeList, payload);
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
    *fetchMarketNoticeAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketNoticeAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '公告新增成功',
      });
      callback();
    },
    *fetchNoticeEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketNoticeSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '公告修改成功',
      });
      callback();
    },
    *fetchNoticeSet({ payload, callback }, { call, put }) {
      const { type } = payload;
      delete payload.type;
      const response = yield call(fetchMarketNoticeSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `公告${type === 'del' ? '删除' : '发布'}成功`,
      });
      callback();
    },
  },
};
