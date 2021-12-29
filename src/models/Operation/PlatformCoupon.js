import { notification } from 'antd';
import { fetchPlatformCouponSave, fetchPagePlatformCoupon } from '@/services/OperationServices';
import moment from 'moment';

export default {
  namespace: 'platformCoupon',

  state: {
    list: {
      list: [],
      total: 0,
    },
    getRecordList: {
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
      const response = yield call(fetchPagePlatformCoupon, payload);
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
    // post 平台券 - 创建平台券 - 新增
    *fetchPlatformCouponSave({ payload, callback }, { call }) {
      const response = yield call(fetchPlatformCouponSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '平台券新增成功',
      });
      callback && callback();
    },
  },
};
