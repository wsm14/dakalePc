import { fetchBlindBoxConfigList } from '@/services/ActiveServices';

export default {
  namespace: 'UpdateBlindBoxRule',

  state: {
    blindBoxRule: {},
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
      console.log(payload);
      const response = yield call(fetchBlindBoxConfigList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          blindBoxRule: content.blindBoxRule,
        },
      });
    },
    // *fetchBlindBoxList({ payload }, { call, put }) {
    //   const response = yield call(fetchBlindBoxList, payload);
    //   if (!response) return;
    //   const { content } = response;
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       blindBox: content.blindBoxProductObjects,
    //     },
    //   });
    // },
  },
};
