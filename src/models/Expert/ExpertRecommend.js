import { notification } from 'antd';
import {
  fetchExpertRemdList,
  fetchExpertRemdStatus,
  fetchExpertRemdDetail,
} from '@/services/ExpertServices';

export default {
  namespace: 'expertRecommend',

  state: {
    list: { list: [], total: 0 },
    detail: {},
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
  },
};
