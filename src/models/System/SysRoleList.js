import { notification } from 'antd';
import { fetchRoleList, fetchGetRoleInfo, fetchRoleEdit } from '@/services/SystemServices';

export default {
  namespace: 'sysRoleList',

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
      const response = yield call(fetchRoleList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.roleList,
          total: content.totalCount,
        },
      });
    },
    *fetchGetRoleInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetRoleInfo, payload);
      if (!response) return;
      const { content } = response;
      callback(content.roleInfo);
    },
    *fetchRoleEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchRoleEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '角色修改成功',
      });
      callback();
    },
  },
};
