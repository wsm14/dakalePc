import { notification } from 'antd';
import cityJson from '@/common/cityJson';
import {
  fetchShareList,
  fetchShareGetFreeCoupon,
  fetchShareStatusClose,
  fetchShareDetail,
  fetchShareGetPlatformBean,
} from '@/services/OperationServices';

export default {
  namespace: 'shareManage',

  state: {
    list: [],
    total: 0,
    couponList: { list: [], total: 0 },
    platformBean: 0,
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
    *fetchShareGetFreeCoupon({ payload }, { call, put }) {
      const response = yield call(fetchShareGetFreeCoupon, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          couponList: { list: content.recordList, total: content.total },
        },
      });
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
    *fetchShareDetail({ payload, callback }, { call }) {
      const response = yield call(fetchShareDetail, payload);
      if (!response) return;
      const { content } = response;
      const { area } = content.userMoments;
      const newObj = {
        ...content.userMoments,
        videoContent: JSON.parse(content.userMoments.videoContent),
        area: (area ? area.split(',') : [])
          .map((item) => {
            const cityIndex = cityJson.findIndex((city) => city.id === item);
            if (cityIndex > -1) {
              return cityJson[cityIndex].name;
            }
          })
          .toString(),
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
