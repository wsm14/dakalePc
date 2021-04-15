import { notification } from 'antd';
import moment from 'moment';
import {
  fetchPuzzleAdList,
  fetchPuzzleAdSet,
  fetchPuzzleAdDetail,
  fetchPuzzleAdRoot,
  fetchPuzzleAdRootSet,
} from '@/services/MarketServices';

export default {
  namespace: 'puzzleAd',

  state: {
    list: [],
    total: 0,
    adRoot: {},
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
    *fetchPuzzleAdDetail({ payload, callback }, { call }) {
      const response = yield call(fetchPuzzleAdDetail, payload);
      if (!response) return;
      const { content = {} } = response;
      const {
        brandIdStr: brandId,
        startShowTime,
        endShowTime,
        jumpUrlType,
        provinceCityDistrictObjects: cityData = [],
      } = content.puzzleAdsDTO;
      if (callback)
        callback({
          ...content.puzzleAdsDTO,
          brandId,
          jumpUrlType: jumpUrlType === '' ? '无' : jumpUrlType,
          provinceCityDistrictObjects: cityData.map(({ provinceCode, cityCode, districtCode }) => ({
            city: [provinceCode, cityCode, districtCode].filter((i) => i),
          })),
          activeDate: [moment(startShowTime, 'YYYY-MM-DD'), moment(endShowTime, 'YYYY-MM-DD')],
        });
    },
    *fetchPuzzleAdRoot({ payload, callback }, { call, put }) {
      const response = yield call(fetchPuzzleAdRoot, payload);
      if (!response) return;
      const { content = {} } = response;
      const { extraParam = '{}' } = content.dictionary;
      const dataValue = JSON.parse(extraParam);
      yield put({
        type: 'save',
        payload: {
          adRoot: { data: content.dictionary, dataValue },
        },
      });
      callback();
    },
    *fetchPuzzleAdRootSet({ payload, callback }, { call }) {
      const response = yield call(fetchPuzzleAdRootSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `广告配置成功`,
      });
      callback();
    },
  },
};
