import { notification } from 'antd';
import moment from 'moment';
import {
  fetchVideoAdNovice,
  fetchVideoAdNoviceSet,
  fetchVideoAdNoviceBean,
  fetchVideoAdNoviceDetail,
  fetchVideoAdNoviceStatus,
} from '@/services/MarketServices';

export default {
  namespace: 'videoAdvert',

  state: {
    list: [],
    total: 0,
    detailList: { list: [], total: 0 },
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
        detailList: { list: [], total: 0 },
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchVideoAdNovice, payload);
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
    *fetchVideoAdNoviceBean({ payload }, { call, put }) {
      const response = yield call(fetchVideoAdNoviceBean, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: { list: content.recordList, total: content.total },
        },
      });
    },
    *fetchVideoAdNoviceStatus({ payload, callback }, { call }) {
      const response = yield call(fetchVideoAdNoviceStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `新手视频下架成功`,
      });
      callback();
    },
    *fetchVideoAdNoviceDetail({ payload, callback }, { call }) {
      const response = yield call(fetchVideoAdNoviceDetail, payload);
      if (!response) return;
      const { content = {} } = response;
      const { rewardStartTime, rewardEndTime } = content.guideMomentsDTO;
      if (callback)
        callback({
          ...content.guideMomentsDTO,
          rewardStartTime: [
            moment(rewardStartTime, 'YYYY-MM-DD'),
            moment(rewardEndTime, 'YYYY-MM-DD'),
          ],
          rewardEndTime: `${rewardStartTime} ~ ${rewardEndTime}`,
        });
    },
    *fetchVideoAdNoviceSet({ payload, callback }, { call }) {
      const response = yield call(fetchVideoAdNoviceSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `视频广告新增成功`,
      });
      callback();
    },
  },
};
