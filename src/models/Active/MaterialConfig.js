import { fetchMaterialConfigList, fetchMaterialConfigUserCode } from '@/services/ActiveServices';

export default {
  namespace: 'materialConfig',

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
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchMaterialConfigList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
          total: content.total,
        },
      });
    },
    *fetchMaterialConfigUserCode({ payload, callback }, { call }) {
      const response = yield call(fetchMaterialConfigUserCode, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
    },
  },
};
