import { notification } from 'antd';
import {
  fetchBackCategoryList,
  fetchBackCategoryAdd,
  fetchBackCategoryEdit,
  fetchFrontCategoryList,
  fetchFrontCategoryAdd,
  fetchFrontCategoryEdit,
  fetchBackCategoryDetail,
  fetchFrontCategoryDetail,
} from '@/services/BaseServices';

export default {
  namespace: 'Category',

  state: {
    list: { list: [], total: 0 },
    frontList: { list: [], total: 0 },
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
    *fetchGetList({ payload, callback }, { call, put }) {
      const response = yield call(fetchBackCategoryList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.classifyDTOList },
        },
      });
    },
    *fetchFrontGetList({ payload, callback }, { call, put }) {
      const response = yield call(fetchFrontCategoryList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          frontList: { list: content.classifyFrontDTOList },
        },
      });
      callback && callback(content.classifyFrontDTOList);
    },
    *fetchBackCategoryAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchBackCategoryAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增类目成功',
      });
      callback();
    },
    *fetchFrontCategoryAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchFrontCategoryAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '新增类目成功',
      });
      callback();
    },
    *fetchBackCategoryEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchBackCategoryEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `修改类目成功`,
      });
      callback();
    },
    *fetchFrontCategoryEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchFrontCategoryEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        // description: `${payload.isDelete ? '删除' : '修改'}类目成功`,
        description: `修改类目成功`,
      });
      callback();
    },
    *fetchBackCategoryDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchBackCategoryDetail, payload);
      if (!response) return;
      callback(response.content);
    },
    *fetchFrontCategoryDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchFrontCategoryDetail, payload);
      if (!response) return;
      callback(response.content);
    },
  },
};
