import { notification } from 'antd';
import {
  fetchFAQList,
  fetchFAQSortList,
  fetchFAQAdd,
  fetchFAQDel,
  fetchFAQSort,
  fetchFAQEdit,
  fetchFAQSortAdd,
  fetchFAQSortEdit,
  fetchFAQSortDel,
  fetchFAQClassSort,
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
      const { content = {} } = response;
      const { commonQuestionCategoryList: cList = [] } = content;

      yield put({
        type: 'save',
        payload: {
          list: {
            list: (Array.isArray(cList) ? cList : []).map((item) => ({
              questionTitle: item.questionCategoryName,
              questionIdString: item.questionCategoryIdString,
              ...item,
            })),
            total: content.total,
          },
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
    *fetchFAQAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchFAQAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '问题新增成功',
      });
      callback();
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
    *fetchFAQSort({ payload, callback }, { call, put }) {
      const { type = 'faq' } = payload;
      const response = yield call({ faq: fetchFAQSort, class: fetchFAQClassSort }[type], payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '排序完成',
      });
      callback();
    },
    *fetchFAQClassSort({ payload, callback }, { call, put }) {
      const response = yield call(fetchFAQClassSort, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '排序完成',
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
