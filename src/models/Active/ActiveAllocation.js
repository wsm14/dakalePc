import { notification } from 'antd';
import {
  fetchAllocationList,
  fetchAllocationNative,
  fetchAllocationDetailAdd,
  fetchAllocationDetailList,
  fetchAllocationDetailStatus,
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
          list: content.recordList,
        },
      });
    },
    *fetchAllocationDetail({ payload }, { call, put }) {
      const response = yield call(fetchAllocationDetailList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          detailList: {
            list: content.recordList,
            total: content.total,
          },
        },
      });
    },
    *fetchAllocationNative({ payload, callback }, { call, put }) {
      const response = yield call(fetchAllocationNative, payload);
      if (!response) return;
      const { content } = response;
      callback(content.recordList);
    },
    *fetchAllocationDetailStatus({ payload, callback }, { call, put }) {
      const response = yield call(fetchAllocationDetailStatus, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '活动配置修改成功',
      });
      callback();
    },
    *fetchAllocationDetailAdd({ payload, callback }, { call, put }) {
      const response = yield call(fetchAllocationDetailAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '活动新增活动配置成功',
      });
      callback();
    },
  },
};
