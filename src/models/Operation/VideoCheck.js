import { notification } from 'antd';
import moment from 'moment';
import { fetchListMomentAudit, fetchAuditMomentDetail } from '@/services/OperationServices';

export default {
  namespace: 'videoCheck',

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
      const response = yield call(fetchListMomentAudit, payload);
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
    *fetchAuditMomentDetail({ payload, callback }, { call, put }) {
      const { type, ...other } = payload;
      const response = yield call(fetchAuditMomentDetail, other);
      if (!response) return;
      const { content } = response;
      const {
        activityGoodsList = {},
        freeOwnerCouponList = {},
        reduceObject = {},
      } = content.moment;

      const newDetail = {
        activityGoodsList,
        freeOwnerCouponList,
        reduceObject,
      };
      callback({ ...content.moment, ...newDetail });
    },
  },
};
