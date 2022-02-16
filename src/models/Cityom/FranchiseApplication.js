import { notification } from 'antd';
import {
  fetchFranchiseAppList,
  fetchFranchiseHandleDetail,
  fetchFranchiseHandle,
} from '@/services/CityomServices';

export default {
  namespace: 'franchiseApp',

  state: {
    list: { list: [], total: 0 },
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
      const response = yield call(fetchFranchiseAppList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.userApplyList, total: content.total },
        },
      });
    },
    *fetchFranchiseHandleDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchFranchiseHandleDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.userApply);
    },
    *fetchFranchiseHandle({ payload, callback }, { call, put }) {
      const response = yield call(fetchFranchiseHandle, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '申请处理成功',
      });
      callback();
    },
  },
};
