import { notification } from 'antd';
import { fetchQueryCurrent, fetchGetAuthMenuTree } from '@/services/LoginServices';
import { fetchPassWordEdit } from '@/services/SystemServices';

export default {
  namespace: 'userInfo',
  state: {
    currentUser: {},
    menuList: [],
    loading: true
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(fetchQueryCurrent);
      if (!response) return;
      const { content } = response;
      yield put({
        type: 'saveCurrentUser',
        payload: content.adminInfo,
      });
    },
    *fetchPassWordEdit({ payload }, { call }) {
      const response = yield call(fetchPassWordEdit, payload);
      if (!response) return;
      notification.success({
        message: '温馨提示',
        description: '修改密码成功',
      });
    },
    *fetchGetAuthMenuTree({ payload, callback }, { call, put }) {
      const response = yield call(fetchGetAuthMenuTree, payload);
      if (!response) return;
      const { content } = response;
      const {flag,permissionTree} = content
      // if(flag == 0 && !permissionTree){
      //   return notification.warning({
      //     message: '温馨提示',
      //     description: '权限不足，请通知管理员配置角色菜单',
      //   });
      // }
      yield put({
        type: 'save',
        payload: {
          menuList: content.permissionTree,
          loading: false
        },
      });
      callback && callback(content.permissionTree);
    },
  },
  reducers: {
    saveCurrentUser(state, { payload }) {
      return { ...state, currentUser: payload || {} };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
