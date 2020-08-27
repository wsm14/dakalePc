import { notification } from 'antd';
import {
  fetchCheckInList,
  fetchCheckInImgTextList,
  fetchCheckInEdit,
  fetchCheckInTextEdit,
  fetchCheckInImgEdit,
} from '@/services/SystemServices';

export default {
  namespace: 'sysCheckIn',

  state: {
    list: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearDetail(state, { payload }) {
      return {
        ...state,
        ...payload,
        detailList: { list: [], total: 0 },
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchCheckInList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.recordList, total: content.totalCount },
        },
      });
    },
    *fetchDetailList({ payload }, { call, put }) {
      const response = yield call(fetchCheckInImgTextList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: { list: content.roleList, total: content.totalCount },
        },
      });
    },
    *fetchCheckInEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchCheckInEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '打卡内容修改成功',
      });
      callback();
    },
    *fetchCheckInTextEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchCheckInTextEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '文案修改成功',
      });
      callback();
    },
    *fetchCheckInImgEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchCheckInImgEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '图片修改成功',
      });
      callback();
    },
  },
};
