// import { fetchUserList, fetchUserOrder } from "@/services/AccountServices";

export default {
  namespace: "accountBusinessList",

  state: {
    list: [],
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
    // *fetchAppUserList({ payload }, { call, put }) {
    //   const response = yield call(fetchUserList, payload);
    //   if (!response) return;
    //   const { data } = response;
    //   yield put({
    //     type: "save",
    //     payload: {
    //       list: data.list,
    //       total: data.total,
    //       current: data.pageNum,
    //       pageSize: data.pageSize,
    //       lastPage: data.lastPage
    //     }
    //   });
    // },
    // *fetchUserOrder({ payload, callback }, { call, put }) {
    //   const response = yield call(fetchUserOrder, payload);
    //   if (!response) return;
    //   const { data } = response;
    //   yield put({
    //     type: "save",
    //     payload: {
    //       userOrder: {
    //         list: data.list,
    //         total: data.total,
    //         current: data.pageNum,
    //         pageSize: data.pageSize
    //       }
    //     }
    //   });
    //   callback();
    // }
  },
};
