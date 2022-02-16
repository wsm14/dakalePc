import { fetchAreaTotalList } from '@/services/ChartServices';

export default {
  namespace: 'areaTotal',

  state: {
    list: [],
    districtList: [],
    detailList: { list: [], total: 0 },
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
      const response = yield call(fetchAreaTotalList, payload);
      if (!response) return;
      const { content } = response;
      const { bucket } = payload;
      yield put({
        type: 'save',
        payload: {
          [bucket == 'districtCode' ? 'districtList' : 'list']: content.result,
        },
      });
    },
  },
};
