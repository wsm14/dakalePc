import { notification } from 'antd';
import {
  fetchProvComList,
  fetchWithdrawList,
  fetchProvComAdd,
  fetchIncomeDetail,
  fetchProvComDetail,
} from '@/services/CityomServices';

export default {
  namespace: 'provCompany',

  state: {
    list: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
    totalData: [],
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearDetail(state, { payload }) {
      return {
        ...state,
        ...payload,
        detailList: { list: [], total: 0 },
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchProvComList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.userMerchantList, total: content.total },
        },
      });
    },
    *fetchWithdrawList({ payload }, { call, put }) {
      const response = yield call(fetchWithdrawList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: {
            list: content.brandList,
            total: content.total,
          },
        },
      });
    },
    *fetchIncomeDetail({ payload }, { call, put }) {
      const response = yield call(fetchIncomeDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content.userMerchantList,
        },
      });
    },
    *fetchProvComDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchProvComDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.merchantDetail);
    },
    *fetchProvComAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchProvComAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '代理添加成功',
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
