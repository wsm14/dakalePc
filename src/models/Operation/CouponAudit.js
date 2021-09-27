import { notification } from 'antd';
import { fetchCouponAuditList, fetchCouponAuditDetail } from '@/services/OperationServices';

export default {
  namespace: 'couponAudit',

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
      const response = yield call(fetchCouponAuditList, payload);
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
    //详情
    *fetchCouponAuditDetail({ payload, callback }, { call }) {
      const response = yield call(fetchCouponAuditDetail, payload);
      if (!response) return;
      const { content } = response;
      const { ownerCouponInfo = {}, auditDetail = {} } = content;

      const { couponDesc = '', serviceDivisionDTO = {} } = ownerCouponInfo;
      const { divisionTemplateType, ...templateOther } = serviceDivisionDTO;

      callback({
        ...ownerCouponInfo,
        ...auditDetail,
        couponDescString: couponDesc?.includes(']')
          ? JSON.parse(couponDesc || '[]').join('\n')
          : couponDesc,
        couponDesc: couponDesc?.includes(']') ? JSON.parse(couponDesc || '[]') : [],
        ...content,
        serviceDivisionDTO: templateOther,
      });
    },
  },
};
