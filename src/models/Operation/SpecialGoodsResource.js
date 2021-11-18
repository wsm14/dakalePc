import { notification } from 'antd';
import {
  fetchSpecialToTop,
  fetchResourceDicts,
  fetchSpecialGoodsList,
  fetchSpecialCancleToTop,
  fetchSpecialConditConfig,
  fetchSpecialCancleRecommend,
} from '@/services/OperationServices';

export default {
  namespace: 'specialGoodsResource',

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
      const response = yield call(fetchSpecialGoodsList, {
        activityType: 'specialGoods', // 限制特惠商品搜索到电商商品
        ...payload,
      });
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
    //特惠资源位取消推荐
    *fetchSpecialCancleRecommend({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialCancleRecommend, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '取消推荐成功',
      });
      callback();
    },
    *fetchSpecialToTop({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialToTop, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '置顶成功',
      });
      callback();
    },
    *fetchSpecialCancleToTop({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialCancleToTop, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '取消置顶成功',
      });
      callback();
    },
    //条件配置
    *fetchSpecialConditConfig({ payload, callback }, { call }) {
      const response = yield call(fetchSpecialConditConfig, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '配置成功',
      });
      callback();
    },
    *fetchResourceDicts({ payload, callback }, { call }) {
      const response = yield call(fetchResourceDicts, payload);
      if (!response) return;
      const { content } = response;
      const { dictionary = {} } = content;
      const extraParam = dictionary.extraParam ? JSON.parse(dictionary.extraParam) : {};

      callback({ ...content.dictionary, ...extraParam });
    },
  },
};
