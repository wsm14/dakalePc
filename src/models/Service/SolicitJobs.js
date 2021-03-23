import { notification } from 'antd';
import { fetchJobsList, fetchJobsSet } from '@/services/ServiceServices';

export default {
  namespace: 'solicitJobs',

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
      const response = yield call(fetchJobsList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchJobsSet({ payload, callback }, { call }) {
      const response = yield call(fetchJobsSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '招聘信息设置成功',
      });
      callback();
    },
  },
};
