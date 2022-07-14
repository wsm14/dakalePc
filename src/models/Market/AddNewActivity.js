import moment from 'moment';
import { notification } from 'antd';
import {
  fetchMarketAddNewActivity,
  fetchMarketAddNewActivityAdd,
  fetchMarketAddNewActivityEdit,
  fetchMarketAddNewActivityDetail,
  fetchMarketAddNewActivityCancel,
} from '@/services/MarketServices';
import { fetchGetPlatformCouponDetail, fetchGetGoodsForUpdate } from '@/services/OperationServices';

export default {
  namespace: 'addNewActivity',

  state: {
    list: { list: [] },
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
    // 裂变拉新活动 -列表
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchMarketAddNewActivity, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.configFissionTemplateDetailList, total: content.total },
        },
      });
    },
    // 裂变拉新活动编辑
    *fetchMarketAddNewActivityEdit({ payload, callback }, { call }) {
      const response = yield call(fetchMarketAddNewActivityEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `活动编辑修改成功`,
      });
      callback();
    },
    // 裂变拉新活动新增
    *fetchMarketAddNewActivityAdd({ payload, callback }, { call }) {
      const response = yield call(fetchMarketAddNewActivityAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `活动新增成功`,
      });
      callback();
    },
    // 裂变拉新活动下架
    *fetchMarketAddNewActivityCancel({ payload, callback }, { call }) {
      const response = yield call(fetchMarketAddNewActivityCancel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `下架修改成功`,
      });
      callback();
    },
    // 裂变拉新活动详情
    *fetchMarketAddNewActivityDetail({ payload, callback }, { call }) {
      const response = yield call(fetchMarketAddNewActivityDetail, payload);
      if (!response) return;
      const { content } = response;
      const { activityBeginTime, activityEndTime, prizeId, prizeType, cityCode, ...other } =
        content.configFissionTemplateDetail || {};

      let goodDetail = {};
      if (prizeType === 'commerce') {
        const data = yield call(fetchGetGoodsForUpdate, { goodsId: prizeId, ownerId: -1 });
        goodDetail = data.content.onlineAllResp;
      }
      if (prizeType === 'platformCoupon') {
        const data = yield call(fetchGetPlatformCouponDetail, { platformCouponId: prizeId });
        const detail = data?.content?.platformCouponDetail || {};
        goodDetail = { ...detail, goodsId: detail.platformCouponId };
      }
      callback({
        ...other,
        prizeType,
        cityCode,
        areaType: cityCode != 'all' ? 'city' : cityCode,
        activityBeginTime: [moment(activityBeginTime), moment(activityEndTime)],
        goodDetail,
      });
    },
  },
};
