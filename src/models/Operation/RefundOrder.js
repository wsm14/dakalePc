import { notification } from 'antd';
import {
  fetchRefundOrderList,
  fetchOrdersDetail,
  fetchRefundPayBack,
  fetchRefundOrderRemark,
  fetchRefundRrderDetail,
} from '@/services/OperationServices';

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
          list: content.orderRefundDetailList,
          total: content.total,
        },
      });
    },
    *fetchRefundPayBack({ payload, callback }, { call }) {
      const response = yield call(fetchRefundPayBack, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '退款成功',
      });
      callback();
    },
    *fetchRefundOrderRemark({ payload, callback }, { call }) {
      const response = yield call(fetchRefundOrderRemark, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '备注成功',
      });
      callback();
    },
    *fetchRefundRrderDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchRefundRrderDetail, payload);
      if (!response) return;
      const { content = {} } = response;
      callback(content.orderRefundDetail);
    },
  },
};
