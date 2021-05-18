import { notification } from 'antd';
import cityJson from '@/common/cityJson';
import { SHARE_AREA_TYPE } from '@/common/constant';
import {
  fetchShareList,
  fetchShareDetail,
  fetchShareVideoPush,
  fetchShareStatusClose,
  fetchShareGetBeanDetail,
  fetchShareGetPlatformBean,
  fetchShareGetAccountBean,
} from '@/services/OperationServices';

export default {
  namespace: 'shareManage',

  state: {
    list: [],
    total: 0,
    couponList: { list: [], total: 0 },
    beanDetal: { list: [], total: 0 },
    platformBean: 0,
    bean: 0,
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    closeList(state, { payload }) {
      return {
        ...state,
        ...payload,
        beanDetal: { list: [], total: 0 },
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchShareList, payload);
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
    *fetchShareVideoPush({ payload, callback }, { call }) {
      const response = yield call(fetchShareVideoPush, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `视频新增成功`,
      });
      callback();
    },
    *fetchShareGetPlatformBean({ payload }, { call, put }) {
      const response = yield call(fetchShareGetPlatformBean, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          platformBean: content.platformBean,
        },
      });
    },
    *fetchShareGetAccountBean({ payload }, { call, put }) {
      const response = yield call(fetchShareGetAccountBean, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          bean: content.merchantDetail.bean || 0,
        },
      });
    },
    *fetchShareGetBeanDetail({ payload }, { call, put }) {
      const response = yield call(fetchShareGetBeanDetail, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          beanDetal: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchShareDetail({ payload, callback }, { call }) {
      const response = yield call(fetchShareDetail, payload);
      if (!response) return;
      const { content } = response;
      const {
        area,
        areaType,
        freeOwnerCoupon, // 免费券
        valuableOwnerCoupon, // 有价券
        specialGoods, // 特惠商品
        promotionType: pType,
      } = content.userMoments;
      const newObj = {
        ...content.userMoments,
        videoContent: JSON.parse(content.userMoments.videoContent),
        free: freeOwnerCoupon // 免费券
          ? { ...freeOwnerCoupon, buyFlag: 0 }
          : '',
        contact: pType // 有价券 特惠商品
          ? {
              promotionType: { reduce: 'coupon', special: 'goods' }[pType],
              ...{ reduce: valuableOwnerCoupon, special: specialGoods }[pType],
            }
          : '',
        area:
          areaType !== 'all'
            ? (area ? area.split(',') : [])
                .map((item) => {
                  const cityIndex = cityJson.findIndex((city) => city.id === item);
                  if (cityIndex > -1) {
                    return cityJson[cityIndex].name;
                  }
                })
                .toString()
            : SHARE_AREA_TYPE[areaType],
      };
      callback(newObj);
    },
    *fetchStatusClose({ payload, callback }, { call }) {
      const response = yield call(fetchShareStatusClose, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '分享下架成功',
      });
      callback();
    },
  },
};
