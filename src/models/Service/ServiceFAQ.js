import { notification } from 'antd';
import {
  fetchFAQList,
  fetchFAQSortList,
  fetchFAQDel,
  fetchFAQEdit,
  fetchFAQSortAdd,
  fetchFAQSortEdit,
  fetchFAQSortDel,
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
        description: '问题删除成功',
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
    *fetchFAQSortAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchFAQSortAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '问题分类新增成功',
      });
      callback();
    },
    *fetchFAQSortEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchFAQSortEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '问题分类修改成功',
      });
      callback();
    },
    *fetchFAQSortDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchFAQSortDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '问题分类删除成功',
      });
      callback();
    },
  },
};
