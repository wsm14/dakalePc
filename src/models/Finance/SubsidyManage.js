import { notification } from 'antd';
import {
  fetchSubsidyList,
  fetchSubsidyGetExcel,
  fetchSubsidyDetail,
  fetchSubsidyEndDel,
  fetchWithdrawSetRemark,
} from '@/services/FinanceServices';

export default {
  namespace: 'subsidyManage',

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
    *fetchSubsidyDetail({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyDetail, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.subsidy);
    },
    *fetchSubsidyEndDel({ payload, callback }, { call }) {
      const { deleteFlag } = payload;
      const response = yield call(fetchSubsidyEndDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `${deleteFlag === 0 ? '删除' : '结束'}成功`,
      });
      callback();
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
