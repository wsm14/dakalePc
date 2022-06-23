import { notification } from 'antd';
import {
  fetchRefundOrderList,
  fetchOrdersDetail,
  fetchRefundPayBack,
  fetchRefundOrderRemark,
  fetchGetExpressInfo,
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
      const { orderRefundDetailList = [], total } = content;
      const list = orderRefundDetailList.map((item) => {
        const { orderDesc, logisticsParam, deductFee } = item;

        return {
          ...item,
          orderDesc: JSON.parse(orderDesc || '{}'),
          logisticsParam: JSON.parse(logisticsParam || '{}'),
          deductFee: JSON.parse(deductFee || '[]'),
        };
      });

      yield put({
        type: 'save',
        payload: {
          list: list,
          total: total,
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
    *fetchGetExpressInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetExpressInfo, payload);
      if (!response) return;
      const { content = {} } = response;
      console.log(content, 'content');
      callback(content);
    },
    *fetchRefundRrderDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchRefundRrderDetail, payload);
      if (!response) return;
      const { content = {} } = response;
      const { orderDetail = {} } = content;
      const data = {
        ...orderDetail,
        orderDesc: JSON.parse(orderDetail.orderDesc || '{}'),
        settleParam: JSON.parse(orderDetail.settleParam || '{}'),
        divisionParam: JSON.parse(orderDetail.divisionParam || '{}'),
      };
      callback(data);
    },
  },
};
