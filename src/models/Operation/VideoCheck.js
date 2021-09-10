import { notification } from 'antd';
import moment from 'moment';
import cityJson from '@/common/cityJson';
import { SHARE_AREA_TYPE } from '@/common/constant';
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
      const { auditDetail = {}, momentInfo = {} } = content;
      const {
        ownerCouponList, // 有价券信息
        activityGoodsList, // 商品信息
        area,
        areaType,
      } = momentInfo;

      const promotionType = activityGoodsList ? 'special' : ownerCouponList ? 'reduce' : '';
      const newDetail = {
        ...auditDetail,
        ...momentInfo,
        promotionType,
        contact: promotionType // 有价券 特惠商品
          ? {
              promotionType: { reduce: 'coupon', special: 'goods' }[promotionType],
              ...{ reduce: ownerCouponList, special: activityGoodsList }[promotionType],
            }
          : '',
        area:
          areaType !== 'all'
            ? areaType === 'near'
              ? `附近 ${Number(area) / 1000} km`
              : (area ? area.split(',') : [])
                  .map((item) => {
                    const cityIndex = cityJson.findIndex((city) => city.id === item);
                    if (cityIndex > -1) {
                      return cityJson[cityIndex].name;
                    }
                  })
                  .toString()
            : SHARE_AREA_TYPE[areaType],
      };
      callback({ ...content, ...newDetail });
    },
  },
};
