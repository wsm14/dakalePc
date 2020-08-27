import { fetchMenuList } from '@/services/SystemServices';

export default {
  namespace: 'sysMenuList',

  state: {
    list: { list: [], total: 0 },
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
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchMenuList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.accessList, total: content.accessList.length },
        },
      });
    },
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
