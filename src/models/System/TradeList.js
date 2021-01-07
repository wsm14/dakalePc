import { notification } from 'antd';
import {
  fetchTradeList,
  fetchTradeAdd,
  fetchTradeSet,
  fetchTradeBaseList,
  fetchTradePlatformList,
  fetchTradeSpecialList,
  fetchTradeBaseSet,
  fetchTradeSpecialSet,
  fetchTradePlatformSet,
  fetchPromotionMoneyGet,
  fetchPromotionMoneySet,
} from '@/services/SystemServices';

export default {
  namespace: 'sysTradeList',

  state: {
    list: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
    platFormList: { list: [], total: 0 },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearDetail(state, { payload }) {
      return {
        ...state,
        ...payload,
        detailList: { list: [], total: 0 },
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchTradeList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.categoryDTOList },
        },
      });
    },
    *fetchTradePlatformList({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradePlatformList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          platFormList: { list: content.merchantSettleList },
        },
      });
      if (callback) callback(content.merchantSettleList);
    },
    *fetchPromotionMoneyGet({ payload, callback }, { call, put }) {
      const response = yield call(fetchPromotionMoneyGet, payload);
      if (!response) return;
      const { content } = response;
      callback(content.categoryPromote);
    },
    *fetchDetailList({ payload, callback }, { call, put }) {
      const { type } = payload;
      const inter = {
        base: { fun: fetchTradeBaseList, pay: {} }, // 基础设施
        special: { fun: fetchTradeSpecialList, pay: payload }, // 特色服务
      }[type];
      delete payload.type;
      const response = yield call(inter.fun, inter.pay);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: {
            list: content[
              { base: 'infrastructures', special: 'specialService' }[type]
            ].map((item) => ({ name: item, value: item })),
          },
        },
      });
      if (callback)
        callback(
          content[{ base: 'infrastructures', special: 'specialService' }[type]].map((item) => ({
            label: item,
            value: item,
          })),
        );
    },
    *fetchPromotionMoneySet({ payload, callback }, { call, put }) {
      const response = yield call(fetchPromotionMoneySet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '推广费设置成功',
      });
      callback();
    },
    *fetchTradeBaseSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeBaseSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '基础设施设置成功',
      });
      callback();
    },
    *fetchTradeSpecialSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeSpecialSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特色服务设置成功',
      });
      callback();
    },
    *fetchTradePlatformSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradePlatformSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '平台服务费设置成功',
      });
      callback();
    },
    *fetchTradeAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增类目成功',
      });
      callback();
    },
    *fetchTradeSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchTradeSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `${payload.isDelete ? '删除' : '修改'}类目成功`,
      });
      callback();
    },
  },
};
