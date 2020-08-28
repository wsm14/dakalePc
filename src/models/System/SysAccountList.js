import { notification } from 'antd';
import {
  fetchSysAccountList,
  fetchAccountEdit,
  fetchGetAccountInfo,
  fetchAccountRoleTree,
  fetchGetAccountRole,
  fetchAccountRoleEdit,
} from '@/services/SystemServices';

export default {
  namespace: 'sysAccountList',

  state: {
    list: [],
    total: 0,
    roleList: [],
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
      const response = yield call(fetchSysAccountList, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          list: content.adminList,
          total: content.totalCount,
        },
      });
    },
    *fetchAccountRoleTree({ payload, callback }, { call, put }) {
      const response = yield call(fetchAccountRoleTree, payload);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'save',
        payload: {
          roleList: content.roleList,
        },
      });
      callback();
    },
    *fetchGetAccountInfo({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetAccountInfo, payload);
      if (!response) return;
      const { content } = response;
      callback(content.adminInfo);
    },
    *fetchGetAccountRole({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetAccountRole, payload);
      if (!response) return;
      const { content } = response;
      callback(content.roleList.map((item) => item.idString));
    },
    *fetchAccountEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchAccountEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '管理员设定成功',
      });
      callback();
    },
    *fetchAccountRoleEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchAccountRoleEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '管理员角色设置成功',
      });
      callback();
    },
  },
};
