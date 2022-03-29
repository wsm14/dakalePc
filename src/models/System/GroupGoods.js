import { notification } from 'antd';
import moment from 'moment';
import { fetchGetListTogetherGroupConfig } from '@/services/SystemServices';
export default {
  namespace: 'groupGoods',

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
      const response = yield call(fetchGetListTogetherGroupConfig, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.locationCityList,
        },
      });
    },
  },
};
