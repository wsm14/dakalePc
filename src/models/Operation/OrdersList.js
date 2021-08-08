import { notification } from 'antd';
import {
  fetchOrdersList,
  fetchOrdersImport,
  fetchOrdersDetail,
  fetchOrderRefundOwn,
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
    *fetchOrderRefundOwn({ payload, callback }, { call }) {
      const response = yield call(fetchOrderRefundOwn, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '退款提交成功',
      });
      callback();
    },
    *fetchOrderDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchOrdersDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.order);
      yield put({
        type: 'save',
        payload: {
          orderDetail: content.order,
        },
      });
    },
  },
};
