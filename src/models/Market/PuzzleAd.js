import { notification } from 'antd';
import {
  fetchPuzzleAdList,
  fetchPuzzleAdSet,
  fetchPuzzleAdDetail,
} from '@/services/MarketServices';

export default {
  namespace: 'puzzleAd',

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
      const response = yield call(fetchPuzzleAdList, payload);
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
    *fetchPuzzleAdSet({ payload, callback }, { call, put }) {
      const { deleteFlag } = payload;
      const response = yield call(fetchPuzzleAdSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `拼图广告${deleteFlag === 0 ? '删除' : '设置'}成功`,
      });
      callback();
    },
    *fetchPuzzleAdDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchPuzzleAdDetail, payload);
      if (!response) return;
      const { content } = response;
      if (callback) callback(content.puzzleAdsDTO);
    },
  },
};
