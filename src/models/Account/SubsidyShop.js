import {
  fetchSubsidyShopList,
  fetchSubsidyShopDetailById,
  fetchSubsidyUserDetailById,
} from '@/services/AccountServices';

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
    //店铺详情
    *fetchSubsidyShopDetailById({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyShopDetailById, payload);
      if (!response) return;
      const { content } = response;
      const { userMerchantObjects = [] } = content.subsidyDTO;
      if (callback) callback(userMerchantObjects);
    },
    //用户补贴详情
    *fetchSubsidyUserDetailById({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyUserDetailById, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.userList);
    },
  },
};
