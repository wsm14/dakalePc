import { notification } from 'antd';
import {
  fetchGoodsList,
  fetchGoodsGetMre,
  fetchGoodsGetClassify,
  fetchUpdataStock,
} from '@/services/BusinessServices';

export default {
  namespace: 'goodsManage',

  state: {
    list: [],
    total: 0,
    mreSelect: [],
    classifySelect: [],
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
      const response = yield call(fetchGoodsList, payload);
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
    *fetchClassifyGetMre({ payload }, { call, put }) {
      const response = yield call(fetchGoodsGetMre, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          mreSelect: content.userMerchantList.map((item) => ({
            name: item.merchantName,
            otherData: item.address,
            value: item.merchantId,
          })),
        },
      });
    },
    *fetchGoodsGetClassify({ payload }, { call, put }) {
      const response = yield call(fetchGoodsGetClassify, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          classifySelect: content.categoryCustomDTOS
            .map((item) => ({
              name: item.categoryName,
              value: item.categoryCustomId,
            }))
            .filter((i) => i.status == 1),
        },
      });
    },
    *fetchUpdataStock({ payload, callback }, { call, put }) {
      const response = yield call(fetchUpdataStock, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '更新库存成功',
      });
      callback();
    },
  },
};
