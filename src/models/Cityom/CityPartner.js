import { notification } from 'antd';
import {
  fetchCityPartnerList,
  fetchCityPartnerAdd,
  fetchWithdrawList,
  fetchIncomeDetail,
} from '@/services/CityomServices';

export default {
  namespace: 'cityPartner',

  state: {
    list: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
    totalData: [],
    inconmeTotalData: [],
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
    *fetchCityPartnerAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchCityPartnerAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '合伙人添加成功',
      });
      callback();
    },
  },
};
