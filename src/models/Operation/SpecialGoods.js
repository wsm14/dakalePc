import { notification } from 'antd';
import {
  fetchSpecialGoodsList,
  fetchSpecialGoodsStatus,
  fetchSpecialGoodsRecommend,
} from '@/services/OperationServices';

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
