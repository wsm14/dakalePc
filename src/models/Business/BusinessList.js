import { notification } from 'antd';
import {
  fetchMerchantList,
  fetchMerchantDetail,
  fetchMerchantStatus,
  fetchMerSaleStatus,
} from '@/services/BusinessServices';

export default {
  namespace: 'businessList',

  state: {
    list: [],
    total: 0,
    totalData: {},
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
      const response = yield call(fetchMerchantList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.userMerchantList,
          total: content.total,
        },
      });
    },
    *fetchMerchantDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.merchantDetail);
    },
    *fetchSetStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家店铺状态修改成功',
      });
      callback();
    },
    *fetchMerSaleStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerSaleStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家经营状态修改成功',
      });
      callback();
    },
  },
};
