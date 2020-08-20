import { notification } from 'antd';
import {
  fetchCheckInList,
  fetchCheckInTextList,
  fetchCheckInImgList,
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
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchCheckInList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.roleList, total: content.totalCount },
        },
      });
    },
    *fetchDetailList({ payload }, { call, put }) {
      const { type } = payload;
      const inter = {
        text: fetchCheckInTextList, // 文案
        img: fetchCheckInImgList, // 图片
      }[type];
      delete payload.type;
      const response = yield call(inter, payload);
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
        description: '寄语修改成功',
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
