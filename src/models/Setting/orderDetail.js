import { fetchOrderDetail } from '@/services/PublicServices';
const DrawerForm = {
  namespace: 'orderDetail',

  state: {
    orderDetail: {},
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
    *fetchOrderDetail({ payload }, { call, put }) {
      const response = yield call(fetchOrderDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          orderDetail: content.orderDTO,
        },
      });
    },
  },
};
export default DrawerForm;
