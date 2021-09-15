import {
  fetchSubsidyShopList,
  fetchSubsidyStatisticDetail,
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
    //补贴详情
    *fetchSubsidyStatisticDetail({ payload, callback }, { call }) {
      const response = yield call(fetchSubsidyStatisticDetail, payload);
      if (!response) return;
      const { content } = response;
      const type=content.type.split('-')
      console.log(type,"112222")
      const detail = {
        checkType:type[0],
        role: type[1],
        list: content.detailList,
      };
      if (callback) callback(detail);
    },
  },
};
