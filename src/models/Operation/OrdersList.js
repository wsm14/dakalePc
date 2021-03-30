import {
  fetchOrdersList,
  fetchOrdersImport,
  fetchOrdersDetail,
} from '@/services/OperationServices';

export default {
  namespace: 'ordersList',

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
      const response = yield call(fetchOrdersList, payload);
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
    *fetchOrdersImport({ payload, callback }, { call }) {
      const response = yield call(fetchOrdersImport, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.orderDTOS);
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
