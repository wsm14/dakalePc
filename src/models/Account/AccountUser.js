import {
  fetchAccountUserTotal,
  fetchAccountUserList,
  fetchUserPeasDetail,
  fetchUserRechargeDetail,
  fetchUserOrderDetail,
} from '@/services/AccountServices';

export default {
  namespace: 'accountUser',

  state: {
    userlist: { list: [], total: 0 },
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
      const response = yield call(fetchAccountUserList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userlist: { list: [content.user], total: content.total },
        },
      });
    },
    *fetchDetailList({ payload }, { call, put }) {
      const { type } = payload;
      const inter = {
        peas: fetchUserPeasDetail, // 卡豆明细
        recharge: fetchUserRechargeDetail, // 充值记录
      }[type];
      delete payload.type;
      const response = yield call(inter, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: { list: content.userMerchantList, total: content.total },
        },
      });
    },
    *fetchUserTotal({ payload }, { call, put }) {
      const response = yield call(fetchAccountUserTotal, payload);
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
      const response = yield call(fetchUserOrderDetail, payload);
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
