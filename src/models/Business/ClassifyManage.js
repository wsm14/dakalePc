import { notification } from 'antd';
import { fetchClassifyList, fetchGoodsGetMre, fetchClassifyDel } from '@/services/BusinessServices';

export default {
  namespace: 'classifyManage',

  state: {
    list: [],
    total: 0,
    mreSelect: [],
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
      const response = yield call(fetchClassifyList, payload);
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
            value: item.merchantId,
          })),
        },
      });
    },
    *fetchClassifyDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchClassifyDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分类删除成功',
      });
      callback();
    },
  },
};
