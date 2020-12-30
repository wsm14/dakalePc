import { notification } from 'antd';
import { fetchTagList, fetchTagAdd, fetchTagEdit } from '@/services/OperationServices';

export default {
  namespace: 'tagManage',

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
      const response = yield call(fetchTagList, payload);
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
    *fetchTagAdd({ payload, callback }, { call }) {
      const response = yield call(fetchTagAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '标签新增成功',
      });
      callback();
    },
    *fetchTagEdit({ payload, callback }, { call }) {
      const response = yield call(fetchTagEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '标签修改成功',
      });
      callback();
    },
  },
};
