import { notification } from 'antd';
import {
  fetchCityPartnerList,
  fetchCityPartnerAdd,
  fetchCityPartnerStatus,
  fetchCityWithdrawDetail,
  fetchCityIncomeDetail,
} from '@/services/CityomServices';

export default {
  namespace: 'cityPartner',

  state: {
    list: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
    totalData: [],
    inconmeTotalData: { recordList: [], totalBean: 0 },
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
      const response = yield call(fetchCityPartnerList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.partnerList, total: content.total },
        },
      });
    },
    *fetchCityWithdrawDetail({ payload }, { call, put }) {
      const response = yield call(fetchCityWithdrawDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchCityIncomeDetail({ payload }, { call, put }) {
      const response = yield call(fetchCityIncomeDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          inconmeTotalData: { recordList: content.recordList, totalBean: content.totalBean },
        },
      });
    },
    *fetchCityPartnerAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchCityPartnerAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '合伙人添加成功',
      });
      callback();
    },
    *fetchCityPartnerStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchCityPartnerStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '合伙人状态修改成功',
      });
      callback();
    },
  },
};
