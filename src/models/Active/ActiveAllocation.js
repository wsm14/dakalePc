import { notification } from 'antd';
import {
  fetchAllocationList,
  fetchAllocationNative,
  fetchAllocationSetEdit,
} from '@/services/ActiveServices';

export default {
  namespace: 'activeAllocation',

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
  },

  effects: {
    *fetchGetList({ payload }, { call, put }) {
      const response = yield call(fetchAllocationList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.recordList.map((version, id) => ({ version, id })),
        },
      });
    },
    *fetchAllocationNative({ payload, callback }, { call, put }) {
      const response = yield call(fetchAllocationNative, payload);
      if (!response) return;
      const { content } = response;
      callback(content.recordList);
    },
    *fetchAllocationSetEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchAllocationSetEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '活动配置成功',
      });
      callback();
    },
  },
};
