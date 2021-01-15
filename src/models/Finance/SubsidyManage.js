import { notification } from 'antd';
import {
  fetchSubsidyList,
  fetchSubsidyGetExcel,
  fetchWithdrawTotal,
  fetchWithdrawSetRemark,
} from '@/services/FinanceServices';

export default {
  namespace: 'subsidyManage',

  state: {
    list: { list: [], total: 0 },
    totalData: { withdrawalFeeSum: 0, withdrawalHandlingFeeSum: 0 },
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
      const response = yield call(fetchSubsidyList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchSubsidyGetExcel({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyGetExcel, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.subsidyList);
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
