import { notification } from 'antd';
import {
  fetchMerchantList,
  fetchMerchantDetail,
  fetchMerSetBandCode,
  fetchMerchantStatus,
  fetchMerBusinessOcr,
  fetchMerchantSet,
  fetchMerchantAdd,
  fetchMerchantTotal,
  fetchMerchantTotalCategory,
  fetchMerVerificationCodeSet,
} from '@/services/BusinessServices';

export default {
  namespace: 'businessList',

  state: {
    list: [],
    total: 0,
    totalData: { chartsLeft: {}, chartsRight: [] },
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
    *fetchGetList({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
        },
      });
      if (callback) callback(content.recordList);
    },
    *fetchMerchantDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerchantDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.merchantDetail);
    },
    *fetchBusinessTotal({ payload }, { call, put }) {
      const response = yield call(fetchMerchantTotal);
      const response2 = yield call(fetchMerchantTotalCategory, payload);
      if (!response && !response2) return;
      const { content } = response;
      const { content: content2 = {} } = response2;
      const {
        parentMerchant = 0,
        childMerchant = 0,
        merchantSettle = 0,
        categoryMerchantCount = [],
      } = content2;

      yield put({
        type: 'save',
        payload: {
          totalData: {
            chartsLeft: { ...content, parentMerchant, childMerchant, merchantSettle },
            chartsRight: categoryMerchantCount.length
              ? categoryMerchantCount
              : [{ categoryName: '无', count: 0 }],
          },
        },
      });
    },
    *fetchMerBusinessOcr({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerBusinessOcr, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
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
    *fetchMerVerificationCodeSet({ payload }, { call, put }) {
      const response = yield call(fetchMerVerificationCodeSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '验证码设置成功',
      });
    },
  },
};
