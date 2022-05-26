import { notification } from 'antd';
import {
  fetchGetSupplierManageList,
  fetchGetSupplierVerifyDetail,
  fetchSupplierVerifyAllow,
  fetchSupplierVerifyReject,
} from '@/services/SCMServices';

export default {
  namespace: 'supplierManage',

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
      const response = yield call(fetchGetSupplierManageList, payload);
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
    *fetchGetSupplierVerifyDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetSupplierVerifyDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.supplierVerifyDetail);
    },
    *fetchSupplierVerifyAllow({ payload, callback }, { call, put }) {
      const response = yield call(fetchSupplierVerifyAllow, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '审核已通过',
      });
      callback();
    },
    *fetchSupplierVerifyReject({ payload, callback }, { call, put }) {
      const response = yield call(fetchSupplierVerifyReject, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '审核已拒绝',
      });
      callback();
    },
  },
};
