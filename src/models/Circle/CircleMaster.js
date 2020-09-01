import {
  fetchMasterTotal,
  fetchMasterList,
  fetchMasterFamily,
  fetchMasterShop,
  fetchMasterIncomeDetails,
  fetchMasterIncomeOrderDetails,
} from '@/services/CircleServices';

export default {
  namespace: 'circleMaster',

  state: {
    masterList: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
    totalData: {},
    orderDetail: {},
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
      const response = yield call(fetchMasterList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          masterList: { list: content.voList, total: content.total },
        },
      });
    },
    *fetchDetailList({ payload }, { call, put }) {
      const { type } = payload;
      const inter = {
        family: fetchMasterFamily, // 家人列表
        shop: fetchMasterShop, // 家店列表
        income: fetchMasterIncomeDetails, // 收益明细
      }[type];
      delete payload.type;
      const response = yield call(inter, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchMasterTotal({ payload }, { call, put }) {
      const response = yield call(fetchMasterTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content.userMerchantList,
        },
      });
    },
    *fetchGetOrderDetails({ payload }, { call, put }) {
      const response = yield call(fetchMasterIncomeOrderDetails, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          orderDetail: content.userMerchantList,
        },
      });
    },
  },
};
