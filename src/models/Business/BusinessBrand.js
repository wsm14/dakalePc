import { notification } from 'antd';
import {
  fetchMerBrandList,
  fetchMerBrandAdd,
} from '@/services/BusinessServices';

export default {
  namespace: 'businessBrand',

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
      const response = yield call(fetchMerBrandList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
          total: content.total,
        },
      });
    },
    *fetchMerBrandAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerBrandAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '品牌新增成功',
      });
      callback();
    },
  },
};
