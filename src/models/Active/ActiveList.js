import { notification } from 'antd';
import { fetchMerVideoList, fetchMerVideoDel } from '@/services/ActiveServices';

export default {
  namespace: 'activeList',

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
      const response = yield call(fetchMerVideoList, payload);
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
    *fetchMerVideoDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchMerVideoDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '视屏删除成功',
      });
      callback();
    },
  },
};
