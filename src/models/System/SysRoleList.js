import { notification } from 'antd';
import {
  fetchRoleList,
  fetchGetRoleInfo,
  fetchGetRoleTree,
  fetchRoleEdit,
  fetchRoleDel,
  fetchRoleMenuSet,
} from '@/services/SystemServices';

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
    *fetchGetRoleTree({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetRoleTree, payload);
      if (!response) return;
      const {
        content: { roleAuthAccessDTOList: idList, accessList },
      } = response;
      callback({
        idList: idList.map((item) => item.idString),
        treeKeyList: accessList.map((item) => ({
          [item.idString]: item.subAuthAccessDTOList.map((ctiem) => ctiem.idString),
        })),
        accessList,
      });
    },
    *fetchRoleEdit({ payload, callback }, { call, put }) {
      const response = yield call(fetchRoleEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '角色信息成功',
      });
      callback();
    },
    *fetchRoleMenuSet({ payload, callback }, { call, put }) {
      const response = yield call(fetchRoleMenuSet, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '角色配置权限成功',
      });
      callback();
    },
    *fetchRoleDel({ payload, callback }, { call, put }) {
      const response = yield call(fetchRoleDel, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '角色删除成功',
      });
      callback();
    },
  },
};
