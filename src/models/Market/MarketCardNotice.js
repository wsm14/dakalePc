import { notification } from 'antd';
import {
  fetchMarketNoticeList,
  fetchMarketNoticeAdd,
  fetchMarketNoticePush,
  fetchMarketNoticeDel,
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
          list: content.record,
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
    *fetchNoticePush({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketNoticePush, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '公告发布成功',
      });
      callback();
    },
    *fetchNoticeDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketNoticeDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '公告删除成功',
      });
      callback();
    },
  },
};
