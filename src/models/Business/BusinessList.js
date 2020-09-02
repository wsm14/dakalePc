import { notification } from 'antd';
import {
  fetchMerchantList,
  fetchMerchantDetail,
  fetchMerSetBandCode,
  fetchMerchantStatus,
  fetchMerchantSet,
  fetchMerchantAdd,
} from '@/services/BusinessServices';

export default {
  namespace: 'businessList',

  state: {
    list: [],
    total: 0,
    totalData: {},
    brandList: { list: [], total: 0 },
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
          list: content.recordList,
        },
      });
    },
    *fetchMerchantDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.merchantDetail);
    },
    *fetchBusinessTotal({ payload }, { call, put }) {
      const response = yield call(fetchMerchantDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content.userMerchantList,
        },
      });
    },
    *fetchMerSetBandCode({ payload }, { call, put }) {
      const response = yield call(fetchMerSetBandCode, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '开户行号设置成功',
      });
    },
    *fetchMerchantAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家新增成功',
      });
      callback();
    },
    *fetchMerchantSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '商家设置成功',
      });
      callback();
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
  },
};
