import { notification } from 'antd';
import {
  fetchSeckillTimeActivityRuleSet,
  fetchSeckillTimeSpecialGoodsList,
  fetchSeckillTimeActivityGoodsSave,
  fetchSeckillTimeCommerceGoodsList,
  fetchMarketActivityGoodsEditRemain,
  fetchSeckillTimeActivityCheckGoods,
} from '@/services/MarketServices';

export default {
  namespace: 'seckillTimeActivity',

  state: {
    onlineGoods: { list: [], total: 0 }, // 电商品
    offlineGoods: { list: [], total: 0 }, // 特惠商品
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
    *fetchSeckillTimeCommerceGoodsList({ payload }, { call, put }) {
      const response = yield call(fetchSeckillTimeCommerceGoodsList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          onlineGoods: { list: content.activityOnlineGoods, total: content.total },
        },
      });
    },
    *fetchSeckillTimeSpecialGoodsList({ payload }, { call, put }) {
      const response = yield call(fetchSeckillTimeSpecialGoodsList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          offlineGoods: { list: content.activityOfflineGoods, total: content.total },
        },
      });
    },
    // 规则设置
    *fetchSeckillTimeActivityRuleSet({ payload, callback }, { call }) {
      const response = yield call(fetchSeckillTimeActivityRuleSet, payload);
      if (!response) return;
      const { marketingSeckillDetail } = response.content;
      callback(marketingSeckillDetail.marketingSeckillId);
    },
    // 商品校验
    *fetchSeckillTimeActivityCheckGoods({ payload, callback }, { call }) {
      const response = yield call(fetchSeckillTimeActivityCheckGoods, payload);
      if (!response) return;
      callback();
    },
    // 绑定商品
    *fetchSeckillTimeActivityGoodsSave({ payload, callback }, { call }) {
      const response = yield call(fetchSeckillTimeActivityGoodsSave, payload);
      if (!response) return;
      callback();
    },
    *fetchMarketActivityGoodsEditRemain({ payload, callback }, { call }) {
      const response = yield call(fetchMarketActivityGoodsEditRemain, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '库存修改成功',
      });
      callback && callback();
    },
  },
};
