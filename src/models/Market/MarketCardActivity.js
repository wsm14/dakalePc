import { notification } from 'antd';
import {
  fetchMarketActivity,
  fetchMarketActivityCancel,
  fetchMarketActivityStore,
  fetchMarketActivityAdd,
} from '@/services/MarketServices';

export default {
  namespace: 'marketCardActivity',

  state: {
    active: { list: [], total: 0 },
    detail: { list: [], total: 0 },
    detailPay: { list: [], total: 0 },
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
      const response = yield call(fetchMarketActivity, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          active: {
            list: content.activityList,
            total: content.total,
          },
        },
      });
    },
    *fetchGetActiveDetail({ payload }, { call, put }) {
      // const response = yield call(fetchMarketActivityStore, payload);
      // if (!response) return;
      // const { content } = response;
      // yield put({
      //   type: 'save',
      //   payload: {
      //     list: content.record,
      //     total: content.total,
      //   },
      // });
    },
    *fetchGetActiveDetailPay({ payload }, { call, put }) {
      // const response = yield call(fetchGetActiveDetail, payload);
      // if (!response) return;
      // const { content } = response;
      // yield put({
      //   type: 'save',
      //   payload: {
      //     list: content.record,
      //     total: content.total,
      //   },
      // });
    },
    *fetchMarketActivityAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketActivityAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '营销活动增加成功',
      });
      callback();
    },
    *fetchMarketActivityCancel({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketActivityCancel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '活动下架成功',
      });
      callback();
    },
  },
};
