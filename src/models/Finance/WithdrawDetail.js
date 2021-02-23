import { notification } from 'antd';
import {
  fetchWithdrawList,
  fetchWithdrawTotal,
  fetchWithdrawExportExcel,
  fetchWithdrawSetRemark,
} from '@/services/FinanceServices';

export default {
  namespace: 'withdrawDetail',

  state: {
    list: { list: [], total: 0 },
    totalData: { withdrawalFeeSum: 0, allWithdrawalFeeSum: 0, withdrawalHandlingFeeSum: 0 },
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
      const response = yield call(fetchWithdrawList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchWithdrawTotal({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content,
        },
      });
    },
    *fetchGetExcel({ payload, callback }, { call }) {
      const response = yield call(fetchWithdrawExportExcel, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.merchantBeanWithdrawalList);
    },
    *fetchWithdrawSetRemark({ payload, callback }, { call }) {
      const response = yield call(fetchWithdrawSetRemark, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '备注设置成功',
      });
      callback();
    },
  },
};
