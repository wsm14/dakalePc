import { fetchSubsidyShopList, fetchSubsidyShopDetailById } from '@/services/AccountServices';

export default {
  namespace: 'subsidyShop',
  state: {
    list: { list: [], total: 0 },
    outBean: 0,
    inBean: 0,
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
    *fetchSubsidyShopList({ payload, callback }, { call, put }) {
      const response = yield call(fetchSubsidyShopList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.subsidyStatisticObjectList, total: content.total },
          outBean: content.outBean,
          inBean: content.inBean,
        },
      });
      if (callback) callback(content.subsidyStatisticObjectList);
    },
    *fetchSubsidyShopDetailById({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyShopDetailById, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.subsidy);
    },
  },
};
