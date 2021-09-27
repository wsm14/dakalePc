import { notification } from 'antd';
import {
  fetchListMomentCommentManagement,
  fetchUpdateCommentsDeleteFlag,
} from '@/services/ServiceServices';

export default {
  namespace: 'commentManage',

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
      const response = yield call(fetchListMomentCommentManagement, payload);
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
    *fetchUpdateCommentsDeleteFlag({ payload, callback }, { call }) {
      const response = yield call(fetchUpdateCommentsDeleteFlag, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '成功',
      });
      callback();
    },
  },
};
