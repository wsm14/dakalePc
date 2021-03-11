import { notification } from 'antd';
import { fetchHandleDetail } from '@/services/BaseServices';
import {
  fetchShareList,
  fetchShareStatusClose,
  fetchShareDetail,
} from '@/services/OperationServices';

export default {
  namespace: 'shareManage',

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
      const response = yield call(fetchShareList, payload);
      if (!response) return;
      return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList,
          total: content.total,
        },
      });
    },
    *fetchShareDetail({ payload, callback }, { call }) {
      const response = yield call(fetchShareDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.userMoments);
    },
    *fetchShareHandleDetail({ payload, callback }, { call }) {
      const response = yield call(fetchHandleDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.logRecordList);
    },
    *fetchStatusClose({ payload, callback }, { call }) {
      const response = yield call(fetchShareStatusClose, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分享下架成功',
      });
      callback();
    },
  },
};
