import moment from 'moment';
import { notification } from 'antd';
import {
  fetchMsgPushList,
  fetchMsgPush,
  fetchMsgPushDel,
  fetchMsgPushAdd,
  fetchMsgPushEdit,
  fetchMsgPushCopy,
  fetchMsgPushRevoke,
  fetchMsgPushDetail,
  fetchMsgAddAndPush,
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
    *fetchMsgPushDetail({ payload, callback }, { call }) {
      const response = yield call(fetchMsgPushDetail, payload);
      if (!response) return;
      const { content } = response;
      callback({
        ...content.messagePush,
        pushTime: moment(content.messagePush.pushTime),
      });
    },
    *fetchMsgPushAdd({ payload, callback }, { call }) {
      const response = yield call(fetchMsgPushAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '消息新增成功',
      });
      callback();
    },
    *fetchMsgAddAndPush({ payload, callback }, { call }) {
      const response = yield call(fetchMsgAddAndPush, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '消息新增并推送成功',
      });
      callback();
    },
    *fetchMsgPushEdit({ payload, callback }, { call }) {
      const response = yield call(fetchMsgPushEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '消息编辑完成',
      });
      callback();
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
    *fetchMsgPushCopy({ payload, callback }, { call }) {
      const response = yield call(fetchMsgPushCopy, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '消息复制成功',
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
