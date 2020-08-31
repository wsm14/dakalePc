import { notification } from 'antd';
import {
  fetchBannerList,
  fetchBannerSet,
  fetchBannerStatusDel,
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
          list: content.recordList,
          total: content.total,
        },
      });
    },
    *fetchBannerStatusDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchBannerStatusDel, payload);
      if (!response) return;
      const { bannerStatus } = payload;
      notification.success({
        message: '温馨提示',
        description: `占位图${bannerStatus === 0 ? '下架' : '删除'}成功`,
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
