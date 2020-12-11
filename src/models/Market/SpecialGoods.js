import { notification } from 'antd';
import { fetchGetHubName } from '@/services/BaseServices';
import {
  fetchSpecialGoodsList,
  fetchSpecialGoodsHubs,
  fetchSpecialGoodsStatus,
  fetchSpecialGoodsRecommend,
} from '@/services/MarketServices';

export default {
  namespace: 'specialGoods',

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
      const response = yield call(fetchSpecialGoodsList, payload);
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
    *fetchGetHubName({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetHubName, payload);
      if (!response) return;
      const { content } = response;
      content && callback(content.businessHubList);
    },
    *fetchSpecialGoodsStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchSpecialGoodsStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特惠活动下架成功',
      });
      callback();
    },
    *fetchSpecialGoodsRecommend({ payload, callback }, { call, put }) {
      const response = yield call(fetchSpecialGoodsRecommend, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '特惠活动推荐成功',
      });
      callback();
    },
  },
};
