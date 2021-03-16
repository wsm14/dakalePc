import { notification } from 'antd';
import {
  fetchCouponList,
  fetchCouponStatus,
  fetchCouponSave,
  fetchCouponDetail,
} from '@/services/OperationServices';

export default {
  namespace: 'couponManage',

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
      const response = yield call(fetchCouponList, payload);
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
    *fetchCouponDetail({ payload, callback }, { call }) {
      const response = yield call(fetchCouponDetail, payload);
      if (!response) return;
      const { content } = response;
      callback(content.couponDetail);
    },
    *fetchCouponSave({ payload, callback }, { call }) {
      const response = yield call(fetchCouponSave, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '优惠券新增成功',
      });
      callback();
    },
    *fetchCouponSet({ payload, callback }, { call }) {
      const response = yield call(fetchCouponStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '优惠券操作成功',
      });
      callback();
    },
  },
};
