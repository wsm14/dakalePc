import { notification } from 'antd';
import { fetchListHittingMain, fetchSaveHittingMain } from '@/services/DaMarkCardServices';

export default {
  namespace: 'pointManage',

  state: {
    list: {
      list: [],
      total: 0,
    },
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
      const response = yield call(fetchListHittingMain, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchSaveHittingMain({ payload, callback }, { call }) {
      const response = yield call(fetchSaveHittingMain, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '主体新增成功',
      });
      callback && callback();
    },
  },
};
