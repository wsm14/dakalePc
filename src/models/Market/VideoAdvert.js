import { notification } from 'antd';
import {
  fetchVideoAdvertList,
  fetchVideoAdvertStatus,
  fetchVideoAdvertRootCount,
  fetchVideoAdvertRootCountSet,
  fetchVideoAdvertCreate,
  fetchVideoAdvertEdit,
  fetchVideoAdvertDetail,
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
      const response = yield call(fetchVideoAdvertList, {
        ...payload,
        status: 1,
        limit: 50,
        page: 1,
      });
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
    *fetchVideoAdvertEdit({ payload, callback }, { call }) {
      const response = yield call(fetchVideoAdvertEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `广告修改成功`,
      });
      callback();
    },
    *fetchVideoAdvertDetail({ payload, callback }, { call }) {
      const { type = 'info', ...cell } = payload;
      const response = yield call(fetchVideoAdvertDetail, cell);
      if (!response) return;
      const { content = {} } = response;
      const {
        age,
        area,
        areaType,
        tagsId,
        freeOwnerCouponList = [], // 免费券
        ownerCouponList = [], // 有价券
        activityGoodsList = [], // 特惠商品
        videoContent,
        ...ohter
      } = content?.momentDetail || {};
      const editData =
        type !== 'info'
          ? {
              url: JSON.parse(videoContent || '{}').url,
              videoId: JSON.parse(videoContent || '{}').videoId,
              free: freeOwnerCouponList[0] || {},
              contact: [...activityGoodsList, ...ownerCouponList],
            }
          : {};
      const newObj = {
        ...ohter,
        age,
        area,
        areaType,
        promotionList: [
          ...freeOwnerCouponList.map((item) => ({ ...item, type: 'free' })),
          ...ownerCouponList.map((item) => ({ ...item, type: 'valuable' })),
          ...activityGoodsList.map((item) => ({ ...item, type: 'special' })),
        ],
        videoContent: JSON.parse(videoContent || '{}'),
        ...editData,
      };
      callback(newObj);
    },
  },
};
