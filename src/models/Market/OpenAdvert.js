import { notification } from 'antd';
import moment from 'moment';
import {
  fetchOpenAdvertList,
  fetchOpenAdvertSet,
  fetchOpenAdvertEdit,
  fetchOpenAdvertStatus,
  fetchOpenAdvertDetail,
} from '@/services/MarketServices';

export default {
  namespace: 'openAdvert',

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
      const response = yield call(fetchOpenAdvertList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.launchImageList,
          total: content.totalCount,
        },
      });
    },
    *fetchOpenAdvertSet({ payload, callback }, { call }) {
      const response = yield call(fetchOpenAdvertSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `开屏广告新增成功`,
      });
      callback();
    },
    *fetchOpenAdvertEdit({ payload, callback }, { call }) {
      const response = yield call(fetchOpenAdvertEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `开屏广告修改成功`,
      });
      callback();
    },
    *fetchOpenAdvertStatus({ payload, callback }, { call }) {
      const { deleteFlag } = payload;
      const response = yield call(fetchOpenAdvertStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: `开屏广告${deleteFlag === 0 ? '删除' : '设置'}成功`,
      });
      callback();
    },
    *fetchOpenAdvertDetail({ payload, callback }, { call }) {
      const response = yield call(fetchOpenAdvertDetail, payload);
      if (!response) return;
      const { content = {} } = response;
      const { startDate, endDate, param = '{}', jumpUrlType } = content.appLaunchImage;
      if (callback)
        callback({
          ...content.appLaunchImage,
          jumpUrlType: jumpUrlType === '' ? '无' : jumpUrlType,
          param: JSON.parse(param || '{}'),
          activeDate: [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
        });
    },
  },
};
