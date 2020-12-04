import { fetchRefundOrderList, fetchOrdersDetail } from '@/services/BusinessServices';

export default {
  namespace: 'refundOrder',

  state: {
    list: [],
    total: 0,
    orderDetail: {},
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
      const response = yield call(fetchRefundOrderList, payload);
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
    *fetchOrderDetail({ payload }, { call, put }) {
      const response = yield call(fetchOrdersDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          orderDetail: content.order,
        },
      });
    },
  },
};
