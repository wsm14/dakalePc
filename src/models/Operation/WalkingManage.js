import { notification } from 'antd';
import {
  fetchWalkManageVaneList,
  fetchWalkManageVaneDetail,
  fetchWalkManageVaneSort,
  fetchWalkManageVaneAdd,
  fetchWalkManageVaneEditDel,
  fetchWalkManageNavigation,
  fetchWalkManageNavigationSort,
} from '@/services/OperationServices';

export default {
  namespace: 'walkingManage',

  state: {
    vaneList: { list: [] },
    navigation: { list: [] },
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
    *fetchWalkManageVaneList({ payload }, { call, put }) {
      const response = yield call(fetchWalkManageVaneList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          vaneList: { list: content.configWindVaneList },
        },
      });
    },
    *fetchWalkManageVaneDetail({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageVaneDetail, payload);
      if (!response) return;
      const { configWindVane } = response.content;
      const { bubbleFlag } = configWindVane;
      callback({ ...configWindVane, bubbleFlag: Boolean(Number(bubbleFlag)) });
    },
    *fetchWalkManageVaneEditDel({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageVaneEditDel, payload);
      if (!response) return;
      const { deleteFlag } = payload;
      notification.success({
        message: '温馨提示',
        description: `风向标${deleteFlag === 0 ? '删除' : '修改'}成功`,
      });
      callback();
    },
    *fetchWalkManageVaneSort({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageVaneSort, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '风向标排序成功',
      });
      callback();
    },
    *fetchWalkManageVaneAdd({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageVaneAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '风向标新增成功',
      });
      callback();
    },
    *fetchWalkManageNavigation({ payload }, { call, put }) {
      const response = yield call(fetchWalkManageNavigation, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          navigation: {
            list: content.recordList,
          },
        },
      });
    },
    *fetchWalkManageNavigationSort({ payload, callback }, { call }) {
      const response = yield call(fetchWalkManageNavigationSort, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '类目排序成功',
      });
      callback();
    },
  },
};
