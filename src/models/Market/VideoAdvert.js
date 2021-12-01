import { notification } from 'antd';
import {
  fetchVideoAdvertList,
  fetchVideoAdvertStatus,
  fetchVideoAdvertRootCount,
  fetchVideoAdvertRootCountSet,
  fetchVideoAdvertCreate,
  fetchVideoAdvertEdit,
  fetchVideoAdvertDetail,
  fetchVideoListMomentTag,
} from '@/services/MarketServices';

import { fetchNewShareStatisticsList } from '@/services/OperationServices';
export default {
  namespace: 'videoAdvert',

  state: {
    list: [],
    total: 0,
    rootCount: {},
    tagList: {},
    tabs: [],
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
    // 视频广告 - 设置初始收藏数和分享数
    *fetchVideoAdvertShareSet({ payload, callback }, { call }) {
      const response = yield call(fetchVideoAdvertEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `设置成功`,
      });
      callback();
    },
    *fetchVideoListMomentTag({ payload, callback }, { call, put }) {
      // 获取所有视频标签列表
      const response = yield call(fetchVideoListMomentTag, payload);
      // 获取UGC视频标签列表
      const responseUGC = yield call(fetchVideoListMomentTag, { type: 'UGC' });
      if (!response && !responseUGC) return;
      const { content } = response;
      const { content: contentUGC } = responseUGC;
      const newObj = {};
      content.configMomentTagList.forEach((i) => (newObj[`${i.configMomentTagId}`] = i.name));
      yield put({
        type: 'save',
        payload: {
          tagList: newObj,
          tabs: contentUGC.configMomentTagList.map((i) => ({
            key: i.configMomentTagId,
            tab: i.name,
          })),
        },
      });
      callback && callback(contentUGC.configMomentTagList[0].configMomentTagId, newObj);
    },
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
      const { type = 'info', momentType, relateId, ...cell } = payload;
      const response = yield call(fetchVideoAdvertDetail, cell);
      // 查询视频统计信息
      let content2 = {};
      if (type === 'info') {
        const response2 = yield call(fetchNewShareStatisticsList, {
          momentType,
          ownerId: relateId,
          momentId: cell.platformMomentId,
        });
        if (!response2) return;
        const { content } = response2;
        content2 = content;
      }
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
        ...content2,
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
