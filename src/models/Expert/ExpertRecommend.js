import { notification } from 'antd';
import {
  fetchExpertCountReport,
  fetchExpertRemdList,
  fetchExpertRemdStatus,
  fetchExpertRemdDetail,
  fetchExpertReportList,
  fetchExpertProcessReport,
} from '@/services/ExpertServices';

export default {
  namespace: 'expertRecommend',

  state: {
    list: { list: [], total: 0 },
    reportList: { list: [], total: 0 },
    detail: {},
    totalReport: 0,
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
      const response = yield call(fetchExpertRemdList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchExpertCountReport({ payload }, { call, put }) {
      const response = yield call(fetchExpertCountReport, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          totalReport: content.countPendingUserReport,
        },
      });
    },
    *fetchGetReportList({ payload }, { call, put }) {
      const response = yield call(fetchExpertReportList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          reportList: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchExpertRemdDetail({ payload }, { call, put }) {
      const response = yield call(fetchExpertRemdDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detail: content.kolMoments,
        },
      });
    },
    *fetchExpertRemdStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchExpertRemdStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '状态修改成功',
      });
      callback();
    },
    *fetchExpertProcessReport({ payload, callback }, { call, put }) {
      const response = yield call(fetchExpertProcessReport, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '举报处理成功',
      });
      callback();
    },
  },
};
