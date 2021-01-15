import { notification } from 'antd';
import {
  fetchMsgPushList,
  fetchMsgPush,
  fetchMsgPushDel,
  fetchMsgPushRevoke,
  fetchFeedBackDetail,
} from '@/services/ServiceServices';

export default {
  namespace: 'messagePush',

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
      const response = yield call(fetchMsgPushList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchFeedBackDetail({ payload, callback }, { call }) {
      const response = yield call(fetchFeedBackDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.userFeedbackDTO);
    },
    *fetchMsgPush({ payload, callback }, { call }) {
      const response = yield call(fetchMsgPush, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '消息推送触发成功',
      });
      callback();
    },
    *fetchMsgPushDel({ payload, callback }, { call }) {
      const response = yield call(fetchMsgPushDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '消息删除成功',
      });
      callback();
    },
    *fetchMsgPushRevoke({ payload, callback }, { call }) {
      const response = yield call(fetchMsgPushRevoke, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '消息撤回成功',
      });
      callback();
    },
  },
};
