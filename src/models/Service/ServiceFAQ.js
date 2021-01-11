import { notification } from 'antd';
import { fetchFAQList, fetchNewsEdit, fetchNewsStatus } from '@/services/ServiceServices';

export default {
  namespace: 'serviceFAQ',

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
      const response = yield call(fetchFAQList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.commonQuestionCategoryList,
          total: content.total,
        },
      });
    },
    *fetchNewsEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchNewsEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新闻动态编辑成功',
      });
      callback();
    },
    *fetchNewsStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchNewsStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新闻动态下架成功',
      });
      callback();
    },
  },
};
