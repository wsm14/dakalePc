import { notification } from 'antd';
import {
  fetchSeckillTimeCommerceGoodsList,
  fetchMarketActivityGoodsEditRemain,
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
    *fetchGetCommerceGoodsList({ payload }, { call, put }) {
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
