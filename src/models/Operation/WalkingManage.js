import { notification } from 'antd';
import { fetchWalkManageVaneList, fetchTagAdd, fetchTagEdit } from '@/services/OperationServices';

export default {
  namespace: 'walkingManage',

  state: {
    vaneList: { list: [] },
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
    *fetchTagAdd({ payload, callback }, { call }) {
      const response = yield call(fetchTagAdd, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '标签新增成功',
      });
      callback();
    },
    *fetchTagEdit({ payload, callback }, { call }) {
      const response = yield call(fetchTagEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '标签修改成功',
      });
      callback();
    },
  },
};
