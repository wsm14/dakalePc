import { notification } from 'antd';
import {
  fetchOrdersList,
  fetchOrdersImport,
  fetchOrdersDetail,
  fetchOrderRefundOwn,
  fetchOrderDeliverGoods,
  fetchOrdersListActionLog,
  fetchBatchSplitAccount,
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
    *fetchOrderDeliverGoods({ payload, callback }, { call }) {
      const response = yield call(fetchOrderDeliverGoods, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '保存成功',
      });
      callback();
    },
    *fetchOrdersListActionLog({ payload, callback }, { call, put }) {
      const response = yield call(fetchOrdersListActionLog, payload);
      if (!response) return;
      const { content = {} } = response;
      const { recordList = [] } = content;
      if (!recordList.length) {
        notification.info({
          message: '温馨提示',
          description: '暂无日志记录',
        });
        return;
      }
      callback(recordList);
    },
    // post 订单列表 - 批量分账
    *fetchBatchSplitAccount({ payload, callback }, { call }) {
      const { type, ...other } = payload;
      const response = yield call(fetchBatchSplitAccount, { ...other });
      if (!response) return;
      if (type === 'one') {
        notification.success({
          message: '温馨提示',
          description: '分账成功',
        });
      } else {
        notification.success({
          message: '温馨提示',
          description: '批量分账成功',
        });
      }
      callback && callback();
    },
  },
};
