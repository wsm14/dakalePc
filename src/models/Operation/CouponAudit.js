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
      const { provinceBean = '', districtBean = '', darenBean = '' } = serviceDivisionDTO;
      const pBean =
        provinceBean || provinceBean == '0' ? (Number(provinceBean) / 100).toFixed(2) : '';
      const dBean =
        districtBean || districtBean == '0' ? (Number(districtBean) / 100).toFixed(2) : '';
      const daBean = darenBean || darenBean == '0' ? (Number(darenBean) / 100).toFixed(2) : '';

      const newDetail = {
        serviceDivisionDTO: {
          provinceBean: pBean,
          districtBean: dBean,
          darenBean: daBean,
        },
      };
      callback({
        ...ownerCouponInfo,
        ...auditDetail,
        couponDescString: couponDesc.includes(']')
          ? JSON.parse(couponDesc || '[]').join('\n')
          : couponDesc,
        couponDesc: couponDesc.includes(']') ? JSON.parse(couponDesc || '[]') : [],
        ...content,
        ...newDetail,
      });
    },
  },
};
