import { notification } from 'antd';
import moment from 'moment';
import {
  fetchRefundPageOrderList,
  fetchRefundApply,
  fetchRefundRefuse,
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
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.orderRefundApplyDetailList,
            total: content.total,
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

    *fetchRefundRrderDetail({ payload, callback }, { call }) {
      const response = yield call(fetchRefundRrderDetail, payload);
      if (!response) return;
      const { content = {} } = response;
      callback(content.orderRefundApplyDetail);
    },
  },
};
