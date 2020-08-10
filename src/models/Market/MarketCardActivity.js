import { fetchMarketActivity, fetchUserOrder } from '@/services/MarketServices';

export default {
  namespace: 'marketCardActivity',

  state: {
    list: [{ name: '盛夏钜惠', id: 1 }],
    total: 0,
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
    // *fetchGetList({ payload }, { call, put }) {
    //   const response = yield call(fetchMarketActivity, payload);
    //   if (!response) return;
    //   const { content } = response;
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       list: content.record,
    //       total: content.total,
    //     },
    //   });
    // },
    *fetchGetActiveDetail({ payload }, { call, put }) {
      // const response = yield call(fetchGetActiveDetail, payload);
      // if (!response) return;
      // const { content } = response;
      // yield put({
      //   type: 'save',
      //   payload: {
      //     list: content.record,
      //     total: content.total,
      //   },
      // });
    },
  },
};
