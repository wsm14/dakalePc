import { notification } from 'antd';
import {
  fetchMarketActivity,
  fetchMarketActivityCancel,
  fetchMarketActivityStore,
  fetchMarketActivityAdd,
  fetchMarketActivityStoreSet,
  fetchMarketActivityCouponSet,
  fetchMarketActivityStoreName,
  fetchStoreGoodsType,
  fetchStoreGoodsCouponInfo,
  fetchStoreOrderDetail,
  fetchStoreCouponDestoryDetail,
} from '@/services/MarketServices';

export default {
  namespace: 'marketCardActivity',

  state: {
    active: { list: [], total: 0 },
    detail: { list: [], total: 0 },
    detailPay: { list: [], total: 0 },
    merchantList: { list: [], total: 0 },
    typeList: [],
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearMerchantList(state, { payload }) {
      return {
        ...state,
        ...payload,
        merchantList: { list: [], total: 0 },
        typeList: [],
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchMarketActivity, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          active: {
            list: content.activityList,
            total: content.total,
          },
          detail: { list: [], total: 0 },
        },
      });
    },
    *fetchGetActiveDetail({ payload }, { call, put }) {
      const response = yield call(fetchMarketActivityStore, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detail: {
            list: content.marketCouponList,
            total: content.total,
          },
        },
      });
    },
    *fetchGetActiveDetailPay({ payload }, { call, put }) {
      const response = yield call(fetchStoreOrderDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailPay: {
            list: content.orderList,
            total: content.total,
          },
        },
      });
    },
    *fetchActiveDestoryDetail({ payload }, { call, put }) {
      const response = yield call(fetchStoreCouponDestoryDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailPay: {
            list: content.orderList,
            total: content.total,
          },
        },
      });
    },
    *fetchMarketActivityStoreName({ payload }, { call, put }) {
      const response = yield call(fetchMarketActivityStoreName, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          merchantList: {
            list: content.merchantList,
            total: content.total,
          },
        },
      });
    },
    *fetchStoreGoodsType({ payload }, { call, put }) {
      const response = yield call(fetchStoreGoodsType, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          typeList: content.categoryCustomList,
        },
      });
    },
    *fetchGetCouponInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchStoreGoodsCouponInfo, payload);
      if (!response) return;
      const {
        content: { marketCouponDeduct },
      } = response;
      const { couponChannels: ccls = '', couponName = '' } = marketCouponDeduct;
      const initialValues = !couponName
        ? payload.status
          ? ""
          : {}
        : {
            ...marketCouponDeduct,
            couponType: '0',
            mark: ccls.indexOf('mark') > -1,
            moment: ccls.indexOf('moment') > -1,
          };
      callback({ initialValues, ...payload });
    },
    *fetchMarketActivityAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketActivityAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '营销活动增加成功',
      });
      callback();
    },
    *fetchMarketActivityCancel({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketActivityCancel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '活动下架成功',
      });
      callback();
    },
    *fetchMarketActivityStoreSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketActivityStoreSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '活动商家新增成功',
      });
      callback();
    },
    *fetchMarketActivityCouponSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchMarketActivityCouponSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '优惠券新增成功',
      });
      callback();
    },
  },
};
