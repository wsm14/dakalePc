import { fetchSaleBlock } from '@/services/ChartServices';

export default {
  namespace: 'saleTotal',

  state: {},

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  effects: {
    *fetchPlatformSubsidy({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchUserAcquire({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, { ...payload, dataType: 'userAcquire' });
      const response2 = yield call(fetchSaleBlock, {
        ...payload,
        dataType: 'userAcquireUserCount',
      });
      if (!response || !response2) return;
      const { content } = response;
      const { content: contentVerify } = response2;
      yield put({
        type: 'save',
        payload: {
          userAcquire: content.data,
          userAcquireUserCount: contentVerify.data,
        },
      });
    },
    *fetchUserConsume({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, { ...payload, dataType: 'userConsume' });
      const response2 = yield call(fetchSaleBlock, {
        ...payload,
        dataType: 'userConsumeUserCount',
      });
      if (!response || !response2) return;
      const { content } = response;
      const { content: contentVerify } = response2;
      yield put({
        type: 'save',
        payload: {
          userConsume: content.data,
          userConsumeUserCount: contentVerify.data,
        },
      });
    },
    *fetchUserOrderBean({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, { ...payload, dataType: 'userOrderBeanScan' });
      const response2 = yield call(fetchSaleBlock, { ...payload, dataType: 'userOrderBeanVerify' });
      if (!response || !response2) return;
      const { content } = response;
      const { content: contentVerify } = response2;
      yield put({
        type: 'save',
        payload: {
          userOrderBeanScan: content.data,
          userOrderBeanVerify: contentVerify.data,
        },
      });
    },
    *fetchMerchantWithdrawal({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchUserInvite({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchDarenCount({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchDarenIncome({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchMomentHangzou({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchMomentXiangxi({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchUserHangzou({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchUserXiangxi({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchSGOnHangzou({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchSGHangzou({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchSGXiangxi({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchSGOnXiangxi({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchMomentOnHangzou({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
    *fetchMomentOnXiangxi({ payload }, { call, put }) {
      const response = yield call(fetchSaleBlock, payload);
      const { dataType } = payload;
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          [dataType]: content.data,
        },
      });
    },
  },
};
