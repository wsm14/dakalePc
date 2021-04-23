import { notification } from 'antd';
import {
  fetchAllSectionList,
  fetchAllSectionAdd,
  fetchAllSectionEdit,
} from '@/services/BaseServices';

export default {
  namespace: 'sectionSetting',

  state: {
    list: [],
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
      const response = yield call(fetchAllSectionList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList || [],
        },
      });
    },
    *fetchAllSectionAdd({ payload, callback }, { call }) {
      const response = yield call(fetchAllSectionAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '部门新增成功',
      });
      callback();
    },
    *fetchAllSectionEdit({ payload, callback }, { call }) {
      const response = yield call(fetchAllSectionEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '部门修改成功',
      });
      callback();
    },
  },
};
