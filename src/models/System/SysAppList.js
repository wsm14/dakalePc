import { notification } from 'antd';
import {
  fetchBannerList,
  fetchBannerStatus,
  fetchBannerDel,
  fetchBannerSet,
  fetchBannerDetail,
} from '@/services/SystemServices';

export default {
  namespace: 'sysAppList',

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
      const response = yield call(fetchBannerList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.list,
          total: content.total,
        },
      });
    },
    *fetchBannerDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchBannerDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content);
    },
    *fetchBannerStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchBannerStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '占位图下架成功',
      });
      callback();
    },
    *fetchBannerDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchBannerDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '占位图删除成功',
      });
      callback();
    },
    *fetchBannerSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchBannerSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '占位图新增成功',
      });
      callback();
    },
  },
};
