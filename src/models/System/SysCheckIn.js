import { notification } from 'antd';
import {
  fetchCheckInList,
  fetchCheckInImgTextList,
  fetchCheckInEdit,
  fetchCheckInTextImgAdd,
  fetchCheckInTextImgEdit,
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
          list: { list: content.recordList, total: content.total },
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
          detailList: {
            list: content.recordList,
            total: content.total,
          },
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
    *fetchCheckInTextImgEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchCheckInTextImgEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '素材修改成功',
      });
      callback();
    },
    *fetchCheckInTextImgAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchCheckInTextImgAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '素材新增成功',
      });
      callback();
    },
  },
};
