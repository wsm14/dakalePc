import { notification } from 'antd';
import {
  fetchCityManageList,
  fetchCityManageSet,
  fetchCityManageStatus,
} from '@/services/SystemServices';

export default {
  namespace: 'manageCity',

  state: {
    list: [],
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
      const response = yield call(fetchCityManageList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.locationCityList,
        },
      });
    },
    *fetchCityManageSet({ payload, callback }, { call }) {
      const response = yield call(fetchCityManageSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '城市设置成功',
      });
      callback();
    },
    *fetchCityManageStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchCityManageStatus, payload);
      if (!response) return;
      const { deleteFlag } = payload;
      notification.success({
        message: '温馨提示',
        description: `城市${deleteFlag === 0 ? '删除' : '修改'}成功`,
      });
      callback();
    },
  },
};
