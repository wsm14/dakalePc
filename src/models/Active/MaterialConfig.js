import { fetchMaterialConfigList, fetchActiveDetail } from '@/services/ActiveServices';

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
    *fetchActiveDetail({ payload, callback }, { call }) {
      const response = yield call(fetchActiveDetail, payload);
      if (!response) return;
      const { content } = response;
      const { templateType, params } = content.activityTemplate;
      callback({
        ...content.activityTemplate,
        type: templateType,
        params: JSON.parse(params || '{}'),
        handle: 'edit',
      });
    },
  },
};
