import { notification } from 'antd';
import {
  fetchMerchantAuditList,
  fetchMerchantAuditDetail,
  fetchMerSaleAudit,
} from '@/services/BusinessServices';

export default {
  namespace: 'businessAuditList',

  state: {
    list: [],
    total: 0,
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
      const response = yield call(fetchMerchantAuditList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.merchantVerifyList,
          total: content.total,
        },
      });
    },
    *fetchMerchantAuditDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantAuditDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.userMerchantVerify);
    },
    *fetchMerSaleAudit({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerSaleAudit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家审核完成',
      });
      callback();
    },
  },
};
