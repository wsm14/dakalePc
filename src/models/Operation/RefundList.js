import { notification } from 'antd';
import moment from 'moment';
import {
  fetchRefundPageOrderList,
  fetchRefundApply,
  fetchRefundRefuse,
  fetchRefundRemark,
  fetchRefundRrderDetail,
} from '@/services/OperationServices';

export default {
  namespace: 'RefundList',

  state: {
    list: { list: [], total: 0 },
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
      const response = yield call(fetchRefundPageOrderList, {
        ...payload,
      });
      if (!response) return;
      const { content } = response;
      const { orderRefundApplyDetailList = [], total } = content;
      const list = orderRefundApplyDetailList.map((item) => {
        const { orderDesc } = item;

        return {
          ...item,
          orderDesc: JSON.parse(orderDesc || '{}'),
        };
      });

      yield put({
        type: 'save',
        payload: {
          list: {
            list: list,
            total: total,
          },
        },
      });
    },

    *fetchRefundApply({ payload, callback }, { call }) {
      const response = yield call(fetchRefundApply, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '同意成功',
      });
      callback();
    },
    *fetchRefundRefuse({ payload, callback }, { call }) {
      const response = yield call(fetchRefundRefuse, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '拒绝成功',
      });
      callback();
    },
    *fetchRefundRemark({ payload, callback }, { call }) {
      const response = yield call(fetchRefundRemark, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '备注成功',
      });
      callback();
    },
    *fetchRefundRrderDetail({ payload, callback }, { call }) {
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
