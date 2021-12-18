import { notification } from 'antd';
import moment from 'moment';
import {
  fetchBankBindingInfoList,
  fetchGetBankBindingInfoRecordById,
  fetchAuditBankBindingInfo,
} from '@/services/BusinessServices';

export default {
  namespace: 'bankChangeCheck',

  state: {
    list: {
      list: [],
      total: 0,
    },
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
    // 银行卡变更审核 - 审核列表
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchBankBindingInfoList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    // 银行卡变更审核 - 审核详情
    *fetchGetBankBindingInfoRecordById({ payload, callback }, { call }) {
      const response = yield call(fetchGetBankBindingInfoRecordById, payload);
      if (!response) return;
      const { content } = response;
      callback && callback(content.ownerBankBindingInfoRecordDTO);
    },
    // 银行卡变更审核 - 银行卡变更审核
    *fetchAuditBankBindingInfo({ payload, callback }, { call }) {
      const response = yield call(fetchAuditBankBindingInfo, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '审核完成',
      });
      callback();
    },
  },
};
