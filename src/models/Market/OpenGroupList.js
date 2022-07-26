import {
  fetchAdminListStartGroup,
  fetchAdminListJoinGroupByGroupId,
  fetchSimulationStartGroup,
} from '@/services/MarketServices';

export default {
  namespace: 'openGroupList',

  state: { list: [], total: 0, userJoinGroupList: [] },

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
      const response = yield call(fetchAdminListStartGroup, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.userStartGroupList,
          total: content.total,
        },
      });
    },
    *fetchAdminListJoinGroupByGroupId({ payload, callback }, { call, put }) {
      const response = yield call(fetchAdminListJoinGroupByGroupId, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          userJoinGroupList: content.userJoinGroupList,
        },
      });
      callback && callback(content.userJoinGroupList);
    },
    *fetchSimulationStartGroup({ payload, callback }, { call }) {
      const response = yield call(fetchSimulationStartGroup, payload);
      if (!response) return;
      callback && callback();
    },
  },
};
