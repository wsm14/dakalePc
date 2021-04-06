import { notification } from 'antd';
import {
  fetchJobsList,
  fetchJobsClassList,
  fetchJobsSet,
  fetchJobsClassSave,
  fetchJobsClassSet,
} from '@/services/ServiceServices';

export default {
  namespace: 'solicitJobs',

  state: {
    list: { list: [], total: 0 },
    jobsClasslist: [],
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
    *fetchJobsClassList({ payload }, { call, put }) {
      const response = yield call(fetchJobsClassList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          jobsClasslist: content.configJobTypeList,
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
    *fetchJobsClassSave({ payload, callback }, { call }) {
      const response = yield call(fetchJobsClassSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '职位信息新增成功',
      });
      callback();
    },
    *fetchJobsClassSet({ payload, callback }, { call }) {
      const response = yield call(fetchJobsClassSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '职位信息设置成功',
      });
      callback();
    },
  },
};
