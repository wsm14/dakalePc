import { notification } from 'antd';
import lodash from 'lodash';
import { fetchQueryCurrent, fetchGetAuthMenuTree } from '@/services/LoginServices';
import { fetchPassWordEdit } from '@/services/SystemServices';

export default {
  namespace: 'userInfo',
  state: {
    currentUser: {},
    flag: 0,
    menuList: [],
    menuBtn: {},
    loading: true,
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
      const btnObj = {};
      const duplicate = (item) => {
        if (item.buttons && item.buttons.length) btnObj[item.accessUrl] = item.buttons;
        if (item.childList && item.childList.length) {
          lodash.flatMap(item.childList, duplicate);
        }
      };
      lodash.flatMap(content.permissionTree, duplicate);
      yield put({
        type: 'save',
        payload: {
          flag: Number(content.flag),
          menuList: content.permissionTree,
          menuBtn: btnObj,
          loading: false,
        },
      });
      callback && callback(content.permissionTree);
    },
  },
};
