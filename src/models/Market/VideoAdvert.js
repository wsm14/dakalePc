import { notification } from 'antd';
import moment from 'moment';
import {
  fetchVideoAdvertList,
  fetchVideoAdvertStatus,
  fetchVideoAdvertRootCount,
  fetchVideoAdvertRootCountSet,
  fetchVideoAdvertCreate,
  fetchVideoAdNoviceDetail,
} from '@/services/MarketServices';

export default {
  namespace: 'videoAdvert',

  state: {
    list: [],
    total: 0,
    rootCount: {},
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
      const response = yield call(fetchVideoAdvertList, payload);
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
    *fetchVideoAdvertStatus({ payload, callback }, { call }) {
      const response = yield call(fetchVideoAdvertStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `视频下架成功`,
      });
      callback();
    },
    *fetchVideoAdvertSearch({ payload, callback }, { call, put }) {
      const response = yield call(fetchVideoAdvertList, { ...payload, limit: 50, page: 1 });
      if (!response) return;
      const { content } = response;
      callback(content.recordList);
    },
    *fetchVideoAdvertRootCount({ payload, callback }, { call, put }) {
      const response = yield call(fetchVideoAdvertRootCount, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          rootCount: content,
        },
      });
      callback();
    },
    *fetchVideoAdvertRootCountSet({ payload, callback }, { call }) {
      const response = yield call(fetchVideoAdvertRootCountSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `设置成功`,
      });
      callback();
    },
    *fetchVideoAdvertCreate({ payload, callback }, { call }) {
      const response = yield call(fetchVideoAdvertCreate, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `广告新增成功`,
      });
      callback();
    },

    *fetchVideoAdNoviceDetail({ payload, callback }, { call }) {
      const response = yield call(fetchVideoAdNoviceDetail, payload);
      if (!response) return;
      const { type } = payload;
      const { content = {} } = response;
      const {
        rewardStartTime,
        rewardEndTime,
        topCategoryIdStr,
        categoryIdStr,
        provinceCode,
        cityCode,
        districtCode,
        videoContentOb,
        freeOwnerCoupon, // 免费券
        valuableOwnerCoupon, // 有价券
        specialGoods, // 特惠商品
        couponIds,
        promotionType: pType,
        promotionIdStr,
      } = content.guideMomentsDTO;
      let editData = {};
      if (type === 'again') {
        editData = {
          categoryNode: [topCategoryIdStr, categoryIdStr],
          area: [provinceCode, cityCode, districtCode],
          videoUrl: videoContentOb.url,
          videoId: videoContentOb.videoId,
        };
      }
      if (callback)
        callback({
          ...content.guideMomentsDTO,
          free: freeOwnerCoupon // 免费券
            ? { ...freeOwnerCoupon, ownerCouponIdString: couponIds, buyFlag: 0 }
            : undefined,
          contact: pType // 有价券 特惠商品
            ? {
                promotionType: { reduce: 'coupon', special: 'goods' }[pType],
                ...{ reduce: valuableOwnerCoupon, special: specialGoods }[pType],
                [{ reduce: 'ownerCouponIdString', special: 'specialGoodsId' }[
                  pType
                ]]: promotionIdStr,
              }
            : '',
          rewardStartTime: rewardStartTime
            ? [moment(rewardStartTime, 'YYYY-MM-DD'), moment(rewardEndTime, 'YYYY-MM-DD')]
            : undefined,
          rewardEndTime: `${rewardStartTime} ~ ${rewardEndTime}`,
          ...editData,
        });
    },
  },
};
