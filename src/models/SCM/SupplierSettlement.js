import moment from 'moment';
import { notification } from 'antd';
import {
  fetchGetSupplierSettlementList,
  fetchGetSupplierSettlementDetail,
  fetchSupplierSettlementAdd,
  fetchSupplierSettlementEdit,
} from '@/services/SCMServices';

export default {
  namespace: 'supplierSettlement',

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
      const response = yield call(fetchGetSupplierSettlementList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.supplierSettlementDetailList,
          total: content.total,
        },
      });
    },
    *fetchGetSupplierSettlementDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetSupplierSettlementDetail, payload);
      if (!response) return;
      const { mode } = payload;
      const { supplierSettlementDetail = {} } = response;
      const { settleTime } = supplierSettlementDetail;
      callback({ ...supplierSettlementDetail, settleTime: mode === 'info' ? settleTime : moment(settleTime) });
    },
    *fetchSupplierSettlementAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchSupplierSettlementAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增成功',
      });
      callback();
    },
    *fetchSupplierSettlementEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchSupplierSettlementEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改成功',
      });
      callback();
    },
  },
};
