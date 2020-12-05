import { notification } from 'antd';
import { fetchFranchiseAppList } from '@/services/CityomServices';

export default {
  namespace: 'areaCenter',

  state: {
    list: { list: [], total: 0 },
    detailList: { list: [], total: 0 },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clearDetail(state, { payload }) {
      return {
        ...state,
        ...payload,
        detailList: { list: [], total: 0 },
      };
    },
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchFranchiseAppList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: { list: content.partnerList, total: content.total },
        },
      });
    },
  },
};
