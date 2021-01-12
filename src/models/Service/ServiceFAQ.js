import { notification } from 'antd';
import {
  fetchFAQList,
  fetchFAQSortList,
  fetchFAQDel,
  fetchFAQEdit,
  fetchNewsStatus,
} from '@/services/ServiceServices';

export default {
  namespace: 'serviceFAQ',

  state: {
    list: { list: [], total: 0 },
    sortList: { list: [], total: 0 },
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
          list: { list: content.commonQuestionCategoryList, total: content.total },
        },
      });
    },
    *fetchFAQSortList({ payload }, { call, put }) {
      const response = yield call(fetchFAQSortList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          sortList: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchFAQDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchFAQDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '删除成功',
      });
      callback();
    },
    *fetchFAQEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchFAQEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '问题编辑成功',
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
