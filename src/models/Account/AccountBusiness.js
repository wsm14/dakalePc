import {
  fetchAccountBusinessList,
  fetchAccountBusinessTotal,
  fetchBusinessPeasDetail,
  fetchBusinessCollectDetail,
  fetchBusinessRechargeDetail,
} from '@/services/AccountServices';

export default {
  namespace: 'accountBusiness',

  state: {
    list: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
    totalData: {},
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
      const response = yield call(fetchAccountBusinessList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.merchantList },
        },
      });
    },
    *fetchDetailList({ payload }, { call, put }) {
      const { type } = payload;
      const inter = {
        peas: fetchBusinessPeasDetail, // 卡豆明细
        collect: fetchBusinessCollectDetail, // 提现记录
        recharge: fetchBusinessRechargeDetail, // 充值记录
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
    *fetchBusinessTotal({ payload }, { call, put }) {
      const response = yield call(fetchAccountBusinessTotal, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalData: content.userMerchantList,
        },
      });
    },
  },
};
