import { fetchAssistanceList, fetchAssistanceDetail } from '@/services/ActiveServices';

export default {
  namespace: 'assistanceList',

  state: {
    list: {
      list: [],
      total: 0,
    },
    info: {
      list: [],
    },
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
    *fetchGetAssistanceList({ payload }, { call, put }) {
      const response = yield call(fetchAssistanceList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchAssistanceDetail({ payload, callback }, { call }) {
      const response = yield call(fetchAssistanceDetail, payload);
      if (!response) return;
      console.log(response);
      // const { content } = response;
      // const { templateType, params } = content.activityTemplate;
      // callback({
      //   ...content.activityTemplate,
      //   type: templateType,
      //   params: JSON.parse(params || '{}'),
      //   handle: 'assistanceInfo',
      // });
    },
  },
};
