import { notification } from 'antd';
import {
  fetchWithdrawAuditAllow,
  fetchWithdrawAuditCommunityList,
  fetchWithdrawAuditCommunityDetail,
} from '@/services/FinanceServices';

export default {
  namespace: 'withdrawAudit',

  state: {
    communityList: { list: [], total: 0 },
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
    *fetchWithdrawAuditCommunityList({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawAuditCommunityList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          communityList: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchWithdrawAuditCommunityDetail({ payload, callback }, { call }) {
      const response = yield call(fetchWithdrawAuditCommunityDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
    },
    *fetchWithdrawAuditAllow({ payload, callback }, { call }) {
      const response = yield call(fetchWithdrawAuditAllow, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '提现审核已通过',
      });
      callback();
    },
  },
};
